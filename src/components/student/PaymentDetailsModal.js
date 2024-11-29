import React from 'react';
import CenteredModal from '../common/Modal';
import Divider from '../common/Divider';
import TAButton from '../common/TAButton';


const PaymentDetailsModal = ({open, onClose, handleAccept}) => {
    // Test values
    const PaymentOption = "zelle"; // Test value for selected payment option
    const email = "test@example.com"; // Test email
    const AccountName = "John Doe"; // Test account name
    const PaymentType = "Savings"; // Test payment type
    const BankName = "Bank of America"; // Test bank name
    const AccountNumber = "123456789"; // Test account number
    const RoutingNumber = "987654321"; // Test routing number
    const creditDebitState = { status: "Valid" }; // Test credit/debit state
    const card = { number: "**** **** **** 1234", expiry: "12/25" }; // Test card details
    const emailPaymentOptions = ['paypal', 'wise', 'payoneer', 'zelle']; // Email-based payment options

    return (
        <CenteredModal show={open} handleClose={onClose} title={"Payment Form"}>
            <div className="container">
                {/* Selected Payment Option */}
                <div className="card mb-4">
                    <div className="card-header text-white bg-primary">Payment Method</div>
                    <div className="card-body">
                        {PaymentOption === "ach" && <p>Direct Deposit (ACH)</p>}
                        {PaymentOption === "cd" && <p>Credit/Debit</p>}
                        {PaymentOption === "wise" && <p>Wise</p>}
                        {PaymentOption === "paypal" && <p>PayPal</p>}
                        {PaymentOption === "zelle" && <p>Zelle</p>}
                        {PaymentOption === "payoneer" && <p>Payoneer</p>}
                    </div>
                </div>

                {/* Email Payment Option Details */}
                {emailPaymentOptions.includes(PaymentOption) && (
                    <div className="card mb-4">
                        <div className="card-header text-white bg-primary">Email Details</div>
                        <div className="card-body">
                            <p>Email: <strong>{email}</strong></p>
                        </div>
                    </div>
                )}

                {/* ACH Payment Details */}
                {PaymentOption === 'ach' && (
                    <div className="card mb-4">
                        <div className="card-header text-white bg-primary">ACH Payment Details</div>
                        <div className="card-body">
                            <p>Account Name: <strong>{AccountName}</strong></p>
                            <p>Payment Type: <strong>{PaymentType || "Not Selected"}</strong></p>
                            <p>Bank Name: <strong>{BankName}</strong></p>
                            <p>Account Number: <strong>{AccountNumber}</strong></p>
                            <p>Routing Number: <strong>{RoutingNumber}</strong></p>
                        </div>
                    </div>
                )}

                {/* Credit/Debit Payment Details */}
                {PaymentOption === 'cd' && (
                    <div className="card mb-4">
                        <div className="card-header text-white bg-primary">Credit/Debit Payment Details</div>
                        <div className="card-body">
                            <p>Credit/Debit State: <strong>{JSON.stringify(creditDebitState)}</strong></p>
                            <p>Card Info: <strong>{card.number} (Expiry: {card.expiry})</strong></p>
                        </div>
                    </div>
                )}

                <Divider />
                <div className='d-flex justify-content-between' >
                    <TAButton buttonText={"Cancel"} handleClick={onClose} />
                    <TAButton style={{width:"150px"}} buttonText={"Book Now"} handleClick={handleAccept} />

                </div>
            </div>
        </CenteredModal>
    );
};

export default PaymentDetailsModal;
