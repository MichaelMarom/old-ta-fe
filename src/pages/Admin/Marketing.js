
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import TAButton from '../../components/common/TAButton'
import AdminLayout from '../../layouts/AdminLayout'
import _ from 'lodash';
import { send_email, send_sms } from '../../axios/admin';
import { toast } from 'react-toastify';
import RichTextEditor from '../../components/common/RichTextEditor/RichTextEditor';
import Input from '../../components/common/Input'

const Marketing = () => {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([])
  const [messageType, setMessageType] = useState('sms');
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

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
  console.log(selectedRows)

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const numbers = selectedRows.map(row => {
    //   if (row?.phone && row?.phone?.startsWith('"') && row?.phone?.endsWith('"') && row?.phone?.length >= 2) {
    //     row.phone = row.phone.slice(1, -1);
    //   }
    //   return row.phone
    // })
    const emails = selectedRows.map(row => {
      return row.email
    })
    // console.log(numbers, emails, message)
    // if (!numbers.length) return toast.warning('Please select phone number to send sms');
    if (!emails.length) return toast.warning('Please select email(s)');
    if (messageType === 'email' && !subject.length) return toast.warning('Please Enter Subject');


    if (!message.length) return toast.warning('Please type your message to send')
    // if (messageType === 'sms') { await send_sms({ numbers, message }); }
    if (messageType === 'email') { await send_email({ emails, message, subject }); }

  }

  return (
    <AdminLayout>
      <div className='container m-auto w-100'>
        <input type="file" onChange={handleFileChange} />
        {true && (
          <div className='d-flex w-100'>
            <div className='d-flex flex-column' style={{ width: "60%" }}>
              <div> <h3>Data:</h3>
                <div></div>
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
                <div className='d-flex justify-content-between'>
                  <label className='d-inline'>Message</label>
                  <p className='text-sm text-secondary text-end d-inline w-75' style={{ fontSize: "12px", color: "gray" }}> {message.length} </p>
                </div>

                {messageType === 'email' ?
                  <>
                    <Input label={"Subject"} setValue={setSubject} value={subject} />
                    <RichTextEditor
                      onChange={(text) => { console.log(text); setMessage(text) }}
                      value={message}
                      height="60vh"
                      required
                      placeholder='Type message that you need to send to student or tutor'
                    />
                  </> :
                  <>
                    <textarea className='form-control' value={message}
                      placeholder='Type message that you need to send to student or tutor'
                      style={{ height: "200px", width: "100%" }}
                      onChange={(e) => e.target.value.length < 145 && setMessage(e.target.value)} />
                    {message.length > 143 && <p className='text-danger w-100 text-end' style={{ fontSize: "12px" }}>
                      Maximum limit 144 characters</p>}
                  </>
                }


                <TAButton buttonText={'Send'} type='submit' />
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout >
  );
};

export default Marketing;
