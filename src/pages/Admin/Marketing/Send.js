
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import TAButton from '../../../components/common/TAButton'
import Layout from './Layout'
import _ from 'lodash';
import { get_email_temp_list, send_email, send_sms } from '../../../axios/admin';
import { toast } from 'react-toastify';

const Marketing = () => {
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([])
  const [messageType, setMessageType] = useState('sms');
  const [message, setMessage] = useState('')
  const [list, setList] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState({})
  const [sentRecords, setSentRecords] = useState([])
  const [sending, setSending] = useState(false)
  const [fileUploaded, setFileUploaded] = useState(false)

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

    console.log([updatedHeaders, arrayOfArraysFormat])
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
    // const numbers = selectedRows.map(row => {
    //   if (row?.phone && row?.phone?.startsWith('"') && row?.phone?.endsWith('"') && row?.phone?.length >= 2) {
    //     row.phone = row.phone.slice(1, -1);
    //   }
    //   return row.phone
    // })
    const emails = selectedRows.map(row => {
      return row.Email
    })
    // console.log(numbers, emails, message)
    // if (!numbers.length) return toast.warning('Please select phone number to send sms');
    if (!emails.length && messageType==="email") return toast.warning('Please select email(s)');


    if (messageType === 'sms' && !message.length)
      return toast.warning('Please type your message to send')

    if (messageType === 'email' && !selectedTemplate.id)
      return toast.warning('Please select email template to send')

    if (messageType === 'sms') { await send_sms({ number: [], message: "hehehhee" }); }
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
  }

  return (
    <Layout>
      <div className='container m-auto w-100'>
        <input type="file" onChange={handleFileUpload} />
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
                  <label>
                    <input
                      type="radio"
                      name="messageType"
                      value="email"
                      checked={messageType === 'email'}
                      onChange={() => setMessageType('email')}
                    />
                    Email
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
                        checked={item.id === selectedTemplate.id}
                      />
                    </div>
                  ))}
                </div> :
                <>
                  <div className='d-flex justify-content-between'>
                    <label className='d-inline'>Message</label>
                    <p className='text-sm text-secondary text-end d-inline w-75'
                      style={{ fontSize: "12px", color: "gray" }}> {message.length}/144 </p>
                  </div>
                  <textarea className='form-control' value={message}
                    placeholder='Type message that you need to send to student or tutor'
                    style={{ height: "200px", width: "100%" }}
                    onChange={(e) => e.target.value.length < 145 && setMessage(e.target.value)} />
                  {message.length > 143 && <p className='text-danger w-100 text-end' style={{ fontSize: "12px" }}>
                    Maximum limit 144 characters</p>}
                </>
              }


              <TAButton buttonText={'Send'} type='submit' loading={sending} />
            </form>
          </div>
        </div>
      </div>
    </Layout >
  );
};

export default Marketing;
