import React from "react";
// import Cards from "react-credit-cards-2";
// import "react-credit-cards-2/dist/es/styles-compiled.css";
import Payment from "payment";
import Input from "./Input";
import { MandatoryFieldLabel, options } from "../tutor/TutorSetup";
import { Countries } from "../../constants/constants";

const PaymentForm = ({ setCreditDebitState, creditDebitState, editMode, errors, setErrors }) => {

    const handleInputChange = (e) => {
        console.log("render2")
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
        console.log("render1")
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
                    <div className="row">
                        <div className="col-6 mb-3">
                            {/* <Input 
                            
                            /> */}
                            <div className="input">

                                <input
                                    disabled={!editMode}
                                    type="text"
                                    name="add1"
                                    className="form-control input__field"
                                    value={creditDebitState.add1}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    required
                                />
                                <span className="input__label" style={{ backgroundColor: "transparent" }}><MandatoryFieldLabel text={"Address1"} /></span>
                            </div>
                        </div>
                        <div className="col-6 mb-3">
                            <div className="input">
                                <input
                                    disabled={!editMode}
                                    type="text"
                                    name="add2"
                                    className="form-control input__field"
                                    value={creditDebitState.add2}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    required
                                />
                                <span className="input__label" style={{ backgroundColor: "transparent" }}>
                                    <MandatoryFieldLabel text={"Address2"} /></span>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 mb-3">
                            {/* <Input 
                            
                            /> */}
                            <div className="input">

                                <input
                                    disabled={!editMode}
                                    type="text"
                                    name="city"
                                    className="form-control input__field"
                                    value={creditDebitState.city}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    required
                                />
                                <span className="input__label" style={{ backgroundColor: "transparent" }}>
                                    <MandatoryFieldLabel text={"City/Town"} /></span>
                            </div>
                        </div>
                        <div className="col-6 mb-3">
                            <div className="input">
                                <input
                                    disabled={!editMode}
                                    type="text"
                                    name="zip"
                                    className="form-control input__field"
                                    value={creditDebitState.zip}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    required
                                />
                                <span className="input__label" style={{ backgroundColor: "transparent" }}>
                                    <MandatoryFieldLabel text={"Zip"} /></span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 mb-3">
                            <div className="input">
                                <select
                                    disabled={!editMode}
                                    type="text"
                                    name="country"
                                    className=" input__field"
                                    value={creditDebitState.country}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    style={{ fontSize: "12px", padding: "5px" }}
                                    required
                                >
                                    <option value={""} >Select</option>
                                    {Countries.map(item => {
                                        return <option value={item.Country}>{item.Country}</option>
                                    })}
                                </select>
                                <span className="input__label" style={{ backgroundColor: "transparent" }}>
                                    <MandatoryFieldLabel text={"Country"} /></span>
                            </div>
                        </div>
                        {options[creditDebitState.country] && <div className="col-6 mb-3">
                            <div className="input">
                                <select
                                    disabled={!editMode}
                                    type="text"
                                    name="state"
                                    className="input__field"
                                    value={creditDebitState.state}
                                    onChange={handleInputChange}
                                    style={{ fontSize: "12px", padding: "5px" }}
                                    onFocus={handleInputFocus}
                                    required
                                >
                                    <option value={""}>Select</option>
                                    {options[creditDebitState.country].map(state => <option value={state}>{state}</option>)}
                                </select>
                                <span className="input__label" style={{ backgroundColor: "transparent" }}>
                                    <MandatoryFieldLabel text={"State"} /></span>
                            </div>

                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PaymentForm;