import React from "react";
// import Cards from "react-credit-cards-2";
// import "react-credit-cards-2/dist/es/styles-compiled.css";
import Payment from "payment";

const PaymentForm = ({ setCreditDebitState, creditDebitState, editMode, errors, setErrors }) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCreditDebitState((prev) => ({ ...prev, [name]: value }));
        if (name === "number") {
            const valid = Payment.fns.validateCardNumber(value);
            if (!valid) {
                return setErrors({ number: 'Invalid Card Number' })
            }
            setErrors({ number: null })
        }
        if (name === 'expiry') {
            const valid = Payment.fns.validateCardExpiry(value);
            if (!valid) {
                return setErrors({ expiry: 'Invalid expiry' })
            }
            setErrors({ expiry: null })
        }
        if (name === 'cvc') {
            const valid = Payment.fns.validateCardCVC(value);
            if (!valid) {
                return setErrors({ cvc: 'Invalid CVC' })
            }
            setErrors({ cvc: null })

        }


    };

    const handleInputFocus = (e) => {
        setCreditDebitState((prev) => ({ ...prev, focus: e.target.name }));
    };

    return (
        <div className='container m-auto'>
            <div className="d-flex justify-content-center align-items-center mt-4" style={{ gap: "2%" }}>
                <div className="mt-4">
                    {/* <Cards
                        number={creditDebitState.number}
                        expiry={creditDebitState.expiry}
                        cvc={creditDebitState.cvc}
                        name={creditDebitState.name}
                        focused={creditDebitState.focus}
                    /> */}
                </div>

                <div className="mt-3">
                    <div className="mb-3">
                        <input
                            required
                            disabled={!editMode}
                            type="number"
                            name="number"
                            className="form-control"
                            placeholder="Card Number"
                            value={creditDebitState.number}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                        />
                        {errors.number && <p className=""><b>{errors.number}</b></p>}
                    </div>
                    <div className="mb-3">
                        <input
                            required
                            disabled={!editMode}
                            type="text"
                            name="name"
                            value={creditDebitState.name}
                            className="form-control"
                            placeholder="Name"
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                        />

                    </div>
                    <div className="row">
                        <div className="col-6 mb-3">
                            <input
                                required
                                disabled={!editMode}
                                type="number"
                                name="expiry"
                                className="form-control"
                                placeholder="Valid Thru"
                                pattern="\d\d/\d\d"
                                value={creditDebitState.expiry}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}

                            />
                            {errors.expiry && <p className=""><b>{errors.expiry}</b></p>}
                        </div>
                        <div className="col-6 mb-3">
                            <input
                                disabled={!editMode}
                                type="number"
                                name="cvc"
                                className="form-control"
                                placeholder="CVC"
                                pattern="\d{3,4}"
                                value={creditDebitState.cvc}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                required
                            />
                            {errors.cvc && <p className=""><b>{errors.cvc}</b></p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PaymentForm;