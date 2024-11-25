
import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import TAButton from '../../../components/common/TAButton'
import Layout from './Layout'
import _ from 'lodash';
import { get_email_temp_list, get_sms_mms_list, send_email, send_sms, send_templated_tutor_marketing_email } from '../../../axios/admin';
import { toast } from 'react-toastify';
import HtmlFilePreview from './EmailTemplateUploader';
import Input from '../../../components/common/Input';
import { MandatoryFieldLabel } from '../../../components/tutor/TutorSetup';

const Marketing = () => {
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([])
  const [messageType, setMessageType] = useState('sms');
  const [message, setMessage] = useState('')
  const [list, setList] = useState([])
  const [sendButtonLoading, setSendButtonLoading] = useState(false)

  const [smsTemps, setSmsTemps] = useState([]);
  const [selectedSmsTemp, setSelectedSmsTemp] = useState({})

  const [selectedTemplate, setSelectedTemplate] = useState({})
  const [sentRecords, setSentRecords] = useState([])
  const [sending, setSending] = useState(false)
  const [fileUploaded, setFileUploaded] = useState(false)
  const [isExternalTemplateSelected, setIsExternalTemplateSelected] = useState('');
  const [uploadedHtmlContent, setUploadedHtmlContent] = useState('');
  const [subject, setEmailSubject] = useState('')

  const csvFile = useRef(null);
  const externmailTempFile = useRef(null);



  useEffect(() => {
    get_sms_mms_list().then(result => !result?.repsonse?.data && setSmsTemps(result))
  }, [])

  useEffect(() => {
    get_email_temp_list().then(result => !result?.response?.data && setList(result))
  }, [])

  const updateExcelFile = () => {
    if (!data || !sentRecords.length) return null;

    const updatedData = data.map(row => {
      if (sentRecords.some(record => record.Email === row.Email)) {
        row.Sent = 1;
      }
      else row.Sent = 0
      return row
    });
    const updatedHeaders = ['Sent', ...headers.filter(header => header !== 'Sent')];

    const arrayOfArraysFormat = updatedData.map(record => {
      return updatedHeaders.map(header => {
        return record[header];
      });
    });

    const ws = XLSX.utils.aoa_to_sheet([updatedHeaders, ...arrayOfArraysFormat]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    return wb;
  };

  const handleDownload = () => {
    const wb = updateExcelFile();
    if (wb) {
      XLSX.writeFile(wb, 'updated_tutor_info_file_email.xlsx');
    } else {
      toast.warning('No data to update.');
    }
  };

  const checkExternalTemplateFile = async () => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/Marketing.html`);
      if (response.ok) {
        const text = await response.text();
        setIsExternalTemplateSelected(text.includes('Marketing Template File'));
      } else {
        setIsExternalTemplateSelected(false);
      }
    } catch (error) {
      setIsExternalTemplateSelected(false);
    }
  };

  useEffect(() => {
    if (messageType === 'ext-temp') {
      checkExternalTemplateFile();
    }
  }, [messageType]);

  const handleFileUpload = (e) => {
    setFileUploaded(true);
    const selectedFile = e.target.files[0];
    setSentRecords([])
    if (selectedFile) {

      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Extract headers
        const headerRow = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
        setHeaders(headerRow);

        // Extract data
        const rowData = XLSX.utils.sheet_to_json(sheet, { header: headerRow, range: 1 });
        setData(rowData);
      };

      reader.readAsBinaryString(selectedFile);
    }
  };

  const toggleRowSelection = (row) => {
    const isSelected = selectedRows.some(selectedRow => selectedRow === row);

    if (!isSelected) {
      setSelectedRows([...selectedRows, row]);
    } else {
      const newSelectedRows = selectedRows.filter(selectedRow => selectedRow !== row);
      setSelectedRows(newSelectedRows);
    }
  };

  useEffect(() => {
    setSelectedRows(data)
  }, [data])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const numbers = selectedRows?.map(row => {
        // if (row?.phone && row?.phone?.startsWith('"') && row?.phone?.endsWith('"') && row?.phone?.length >= 2) {
        //   row.phone = row.phone.slice(1, -1);
        // }
        return `${row.phone}`
      })
      const emails = selectedRows.map(row => {
        return row.Email
      })

      if (!numbers.length && messageType === 'sms') return toast.warning('Please select phone number to send sms');
      if (!emails.length && messageType === "email") return toast.warning('Please select email(s)');
      if (!emails.length && messageType === "ext-temp") return toast.warning('Please select email(s)');


      if (messageType === 'sms' && !selectedSmsTemp.text)
        return toast.warning('Please Select Sms Template')

      if (messageType === 'email' && !selectedTemplate.id)
        return toast.warning('Please select email template to send')

      if (messageType === 'sms') { await send_sms({ numbers, ...selectedSmsTemp, message: selectedSmsTemp.text, subject: selectedSmsTemp.name, }); }
      if (messageType === 'email') {
        setSending(true)
        send_email({ emails, message: selectedTemplate.text, subject: selectedTemplate.name })
          .then(() => {
            setSentRecords([...sentRecords, ...selectedRows])
            const updatedData = data.map(row => {
              if (selectedRows.concat(sentRecords).some(record => record.Email === row.Email)) {
                row.Sent = 1;
              }
              else row.Sent = 0
              return row
            });
            setData(updatedData)
          }).finally(() => {
            setSending(false)
          })
      }

      if (messageType === 'ext-temp' && emails.length) {
        setSendButtonLoading(true)

        subject.length && await send_templated_tutor_marketing_email({
          emails,
          subject,
          htmlTemplate: uploadedHtmlContent
        });
        setUploadedHtmlContent('')
        setFileUploaded('')
        setSelectedRows([])
        setData([])
        setSendButtonLoading(false)
        if (csvFile.current) {
          csvFile.current.value = null;
        }
        if (externmailTempFile.current) {
          externmailTempFile.current.value = null;
        }
        toast.success('Email sent successfully')
      }
    }

    catch (err) {
      setSendButtonLoading(false)
      toast.error(err?.response?.data?.body?.response?.body?.errors?.[0])
    }
  }

  return (
    <Layout>
      <div className='container m-auto w-100' style={{ height: "calc(100vh - 80px)", overflowY: "auto" }}>
        <input type="file" onChange={handleFileUpload} ref={csvFile} />
        <div className='d-flex w-100'>
          <div className='d-flex flex-column' style={{ width: "60%" }}>
            <div>
              <h3>Data:</h3>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <label>
                    <input
                      style={{ accentColor: "orange" }}
                      type="checkbox"
                      checked={selectedRows.length === data.length}
                      onChange={() => selectedRows.length ?
                        setSelectedRows([]) :
                        setSelectedRows(data)}
                    />
                    <span style={{ marginLeft: "5px" }}>Select All</span>
                  </label>
                </div>
                {!!sentRecords.length && <div>
                  <button className='btn btn-secondary btn-sm' onClick={handleDownload}>
                    Download Updated File
                  </button>
                </div>
                }

              </div>
            </div>
            <div style={{ overflow: "auto", height: "70vh" }}>
              <table className='' style={{ overflow: "auto" }}>
                <thead>
                  <tr>
                    <th>Sr#</th>
                    <th>Action</th>
                    {headers.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}

                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className='col-1'>{rowIndex + 1}</td>
                      <td>
                        <input
                          style={{ accentColor: sentRecords.some(record => record.Email === row.Email) ? "green" : "orange" }}
                          type="checkbox"
                          checked={selectedRows.some(selectedRow => _.isEqual(selectedRow, row))}
                          onChange={() => toggleRowSelection(row)}
                        />
                      </td>
                      {headers.map((header, columnIndex) => (
                        <td key={columnIndex}>{row[header]}</td>
                      ))}

                      {/* <td>
                        <TAButton handleClick={() => setSelectedRows([...selectedRows, row])} buttonText={"Select"} />
                      </td> */}

                    </tr>
                  ))}
                </tbody>
              </table>
              {fileUploaded && !data.length && <p className='text-danger'>No record found</p>}
            </div>
          </div>
          <div className='rounded border p-2 m-2 shadow ' style={{ width: "40%" }}>
            <form onSubmit={handleSubmit}>
              <div className='d-flex ' style={{ gap: "5px" }}>

                <div>
                  <label style={{ marginRight: "20px" }}>
                    <input
                      type="radio"
                      name="messageType"
                      value="sms"
                      checked={messageType === 'sms'}
                      onChange={() => setMessageType('sms')}
                    />
                    SMS
                  </label>
                  <label style={{ marginRight: "20px" }}>
                    <input
                      type="radio"
                      name="messageType"
                      value="email"
                      checked={messageType === 'email'}
                      onChange={() => setMessageType('email')}
                    />
                    Email
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="messageType"
                      value="ext-temp"
                      checked={messageType === 'ext-temp'}
                      onChange={() => setMessageType('ext-temp')}
                    />
                    External Template
                  </label>
                </div>
              </div>

              {messageType === 'email' ?
                <div>
                  {list.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedTemplate(item)}
                      className="click-effect-elem rounded shadow-sm p-2 
                        justify-content-between border m-1 d-flex border-primary"
                    >

                      <h5 className="click-elem m-0 text-decoration-underline d-inline-block">
                        {item.name}
                      </h5>

                      <input
                        type="checkbox"
                        style={{
                          height: "20px",
                          width: "20px",
                          cursor: "pointer",
                        }}
                        defaultChecked={item.id === selectedTemplate.id}
                      />
                    </div>
                  ))}
                  {selectedTemplate.id && <div className='border p-2 m-2 shadow'>
                    <h6 style={{ fontWeight: "bold" }}> Message:</h6>
                    <div style={{ maxHeight: "50vh", overflowY: "auto" }} dangerouslySetInnerHTML={{ __html: selectedTemplate.text }}></div>
                  </div>}
                </div> : messageType === 'sms' ?
                  <>

                    {smsTemps.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedSmsTemp(item)}
                        className="click-effect-elem rounded shadow-sm p-2 
                        justify-content-between border m-1 d-flex border-primary"
                      >

                        <h5 className="click-elem m-0 text-decoration-underline d-inline-block">
                          {item.name}
                        </h5>

                        <input
                          type="checkbox"
                          style={{
                            height: "20selepx",
                            width: "20px",
                            cursor: "pointer",
                          }}
                          defaultChecked={item.id === selectedSmsTemp.id}
                        />
                      </div>
                    ))}
                    {selectedSmsTemp.id && <div className='border p-2 m-2 shadow'>
                      <h6 style={{ fontWeight: "bold" }}> Message:</h6> {selectedSmsTemp.text}
                    </div>}
                    {/* <div className='d-flex justify-content-between'>
                    <label className='d-inline'>Message</label>
                    <p className='text-sm text-secondary text-end d-inline w-75'
                      style={{ fontSize: "12px", color: "gray" }}> {message.length}/144 </p>
                  </div> */}

                    {/* <textarea className='form-control' value={message}
                    placeholder='Type message that you need to send to student or tutor'
                    style={{ height: "200px", width: "100%" }}
                    onChange={(e) => e.target.value.length < 145 && setMessage(e.target.value)} />
                  {message.length > 143 && <p className='text-danger w-100 text-end' style={{ fontSize: "12px" }}>
                    Maximum limit 144 characters</p>} */}
                  </> :
                  <>
                    <div className='m-2'>
                      <Input value={subject} setValue={setEmailSubject} label={<MandatoryFieldLabel text={"Enter Subject"} />} />
                    </div>
                    <HtmlFilePreview onFileSelect={setUploadedHtmlContent}
                      fileContent={uploadedHtmlContent} externmailTempFile={externmailTempFile} />
                  </>
              }


              <TAButton buttonText={'Send'} type='submit' loading={sending || sendButtonLoading} />
            </form>
          </div>
        </div>
      </div>
    </Layout >
  );
};

export default Marketing;
