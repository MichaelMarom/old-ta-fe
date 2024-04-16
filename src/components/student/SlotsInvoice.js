import React from 'react';
import { showDate } from '../../helperFunctions/timeHelperFunctions';
import logo from '../../assets/images/tutoring Logo.png'
import moment from 'moment-timezone'
import { HiPrinter } from "react-icons/hi2";
import { MdDownloadForOffline } from "react-icons/md";
import Tooltip from '../common/ToolTip';

const SlotsInvoice = ({
  selectedType,
  studentName,
  tutorName,
  invoiceNum,
  selectedSlots,
  subject,
  rate,
  handleAccept,
  handleClose,
  introDiscountEnabled,
  timeZone
}) => {
  const subtotal = selectedSlots.length * ((introDiscountEnabled && selectedType === 'intro') ?
    (parseInt(rate.split('$')[1]) / 2) :
    parseInt(rate.split('$')[1]));

  const rateHalf = (rate) => parseInt(rate.split('$')[1]) / 2;
  const currentTime = () => {
    const currentDate = moment().tz(timeZone).toDate();
    return currentDate
  }



  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 p-2">
          <div className="card">
            <div className="card-header text-center p-0">
              <img src={logo} style={{
                width: "100%",
                height: "100px"
              }} alt="logo" />
            </div>
            <div className="card-body">
              <div className="mb-4">
                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <div className='text-center ' style={{ fontSize: '16px' }}>
                    <span className='fs-5 font-weight-bold'>  Invoice</span>  #
                    {invoiceNum}
                  </div>
                  <div>Date: {showDate(currentTime())}</div>
                </div>
                {
                  (selectedType === 'intro' && introDiscountEnabled) &&
                  < h5 className='text-center mb-3 text-danger font-weight-bold'
                    style={{ fontSize: '16px' }}>Avail 50% discount on Intro Session</h5>
                }
                <div className='d-flex justify-content-between px-2'>
                  <div style={{ fontSize: '12px' }}><span className='fs-6 font-weight-bold'>Student: </span>{studentName}</div>
                  <div style={{ fontSize: '12px' }}><span className='fs-6 font-weight-bold'>Tutor: </span> {tutorName}</div>
                </div>
              </div>
              <table className="table table-borderless table-striped"
                style={{ fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th className='text-dark  border-0'>Slot</th>
                    <th className='text-dark  border-0'>Subject</th>
                    <th className='text-dark  border-0'>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSlots.map((slot, index) => (
                    <tr key={index}>
                      <td className='border-0'>{showDate(slot.start)}</td>
                      <td className='border-0'>{subject}</td>
                      {(introDiscountEnabled && selectedType === 'intro') ? <>
                        <td className='border-0'>  <s>{rate}</s> ${rateHalf(rate)}.00</td>
                      </>
                        : <td className='border-0'> {rate}</td>}
                    </tr>
                  ))}
                  <tr>
                    <td className='border-0 fw-bold'>Subtotal:</td>
                    <td className='border-0'></td>
                    <td className='border-0 fw-bold'>${subtotal.toFixed(2)}</td>

                  </tr>
                </tbody>
              </table>
              <hr />
              <div className='d-flex justify-content-between align-items-center'>
                <div className='d-flex ' style={{ gap: "10px" }}>
                  <Tooltip text={'print invoice'}>
                    <HiPrinter size={20} style={{ cursor: "pointer" }} onClick={() => window.print()} /></Tooltip>
                  <Tooltip text={'download invoice'} >
                    <MdDownloadForOffline size={20} style={{ cursor: "pointer" }} /></Tooltip>
                </div>
                <div>
                  <button className='btn btn-sm btn-secondary' onClick={handleClose}>Cancel</button>
                  <button className='btn btn-sm btn-primary' onClick={handleAccept}>Accept</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default SlotsInvoice;
