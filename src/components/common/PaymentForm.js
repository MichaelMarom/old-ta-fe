import React from "react";
// import Cards from "react-credit-cards-2";
// import "react-credit-cards-2/dist/es/styles-compiled.css";
import Payment from "payment";
import Input from "./Input";
import { options } from "../../pages/tutor/TutorSetup";
import {MandatoryFieldLabel, OptionalFieldLabel} from "../common/Input/InputLabel"
import { Countries } from "../../constants/constants";

const PaymentForm = ({ setCreditDebitState, creditDebitState, editMode, errors, setErrors, card = "primary", setCard = () => { } }) => {

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
            <div className="d-flex justify-content-center align-items-center mt-4 " style={{ gap: "2%" }}>

                <div className="mt-4">
                    {/* <Cards
                        number={creditDebitState.number}
                        expiry={creditDebitState.expiry}
                        cvc={creditDebitState.cvc}
                        name={creditDebitState.name}
                        focused={creditDebitState.focus}
                    /> */}
                </div>

                <div className="mt-3 border rounded shadow p-2">
                    <div className="d-flex justify-content-between mb-2">
                        <div className="form-check form-check-inline">
                            <input disabled={!editMode} required
                                className="form-check-input border border-dark"
                                type="radio"
                                name="card-cat"
                                value="primary"
                                checked={card === "primary"}
                                onChange={() => setCard("primary")}
                                id='card-cat-primary'
                            />
                            <label className="form-check-label" htmlFor='card-cat-primary'>
                                Primary
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input disabled={!editMode} required
                                className="form-check-input border border-dark"
                                type="radio"
                                name="card-cat"
                                value="secondary"
                                checked={card === "secondary"}
                                onChange={() => setCard("secondary")}
                                id='card-cat-secondary'
                            />
                            <label className="form-check-label" htmlFor='card-cat-secondary'>
                                Secondary
                            </label>
                        </div>

                    </div>
                    <div className="mb-3">
                        <div className="input">
                            <input
                                required
                                disabled={!editMode}
                                type="number"
                                name={card === "primary" ? "number_p" : "number_s"}
                                className="form-control input__field"
                                value={card === "primary" ? creditDebitState.number_p : creditDebitState.number_s}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                            />
                            <span className="input__label roboto-medium bg-transparent">

                                <MandatoryFieldLabel editMode={editMode} text={"Card Number"} /></span>
                        </div>

                        {errors.number_p && <p className="text-danger"><b>{errors.number_p}</b></p>}
                        {errors.number_s && <p className="text-danger"><b>{errors.number_s}</b></p>}

                    </div>
                    <div className="mb-3">
                        <div className="input">
                            <input
                                required
                                disabled={!editMode}
                                type="text"
                                name={card === "primary" ? "name_p" : "name_s"}
                                value={card === "primary" ? creditDebitState.name_p : creditDebitState.name_s}
                                className="form-control input__field"
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                            />
                            <span className="input__label roboto-medium bg-transparent"><MandatoryFieldLabel editMode={editMode} text="Name" /></span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 mb-3">
                            <div className="input">
                                <input
                                    required
                                    disabled={!editMode}
                                    type="number"
                                    name={card === "primary" ? "expiry_p" : "expiry_s"}
                                    className="form-control input__field"
                                    pattern="\d\d/\d\d"
                                    value={card === "primary" ? creditDebitState.expiry_p : creditDebitState.expiry_s}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                />
                                <span className="input__label roboto-medium bg-transparent"><MandatoryFieldLabel editMode={editMode} text="Valid Thru" /></span>
                            </div>
                            {errors.expiry_p && <p className="text-danger"><b>{errors.expiry_p}</b></p>}
                            {errors.expiry_s && <p className="text-danger"><b>{errors.expiry_s}</b></p>}

                        </div>
                        <div className="col-6 mb-3">
                            <div className="input">
                                <input
                                    disabled={!editMode}
                                    type="number"
                                    name={card === "primary" ? "cvc_p" : "cvc_s"}
                                    className="form-control input__field"
                                    pattern="\d{3,4}"
                                    value={card === "primary" ? creditDebitState.cvc_p : creditDebitState.cvc_s}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    required
                                />
                                <span className="input__label roboto-medium bg-transparent"><MandatoryFieldLabel editMode={editMode} text="CVC" /></span>
                            </div>
                            {errors.cvc_p && <p className="text-danger"><b>{errors.cvc_p}</b></p>}
                            {errors.cvc_s && <p className="text-danger"><b>{errors.cvc_s}</b></p>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 mb-3">
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
                                <span className="input__label roboto-medium" style={{ backgroundColor: "transparent" }}>
                                    <MandatoryFieldLabel editMode={editMode} text={"Address1"} />
                                </span>
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
                                />
                                <span className="input__label roboto-medium" style={{ backgroundColor: "transparent" }}>
                                    <OptionalFieldLabel label={"Address2"} editMode={editMode} />
                                </span>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 mb-3">
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
                                <span className="input__label roboto-medium" style={{ backgroundColor: "transparent" }}>
                                    <MandatoryFieldLabel editMode={editMode} text={"City/Town"} />
                                </span>
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
                                <span className="input__label roboto-medium" style={{ backgroundColor: "transparent" }}>
                                    <MandatoryFieldLabel editMode={editMode} text={"Zip"} /></span>
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
                                    style={{ fontSize: "12px", padding: "5px", background: editMode ? "white" : "#e9ecef" }}
                                    required
                                >
                                    <option value={""} >Select</option>
                                    {Countries.map(item => {
                                        return <option value={item.Country} key={item.Country}>{item.Country}</option>
                                    })}
                                </select>
                                <span className="input__label roboto-medium" style={{ backgroundColor: "transparent" }}>
                                    <MandatoryFieldLabel editMode={editMode} text={"Country"} />
                                </span>
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
                                    style={{ fontSize: "12px", padding: "5px", backgroundColor: editMode ? "white" : "#e1e1e1" }}
                                    onFocus={handleInputFocus}
                                    required
                                >
                                    <option value={""}>Select</option>
                                    {options[creditDebitState.country].map(state => <option value={state} key={state}>{state}</option>)}
                                </select>
                                <span className="input__label roboto-medium" style={{ backgroundColor: "transparent" }}>
                                    <MandatoryFieldLabel editMode={editMode} text={"State"} />
                                </span>
                            </div>

                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PaymentForm;

