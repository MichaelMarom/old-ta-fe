import React, { useEffect, useState } from 'react';
import PaymentForm from '../../common/PaymentForm';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { get_bank_details, post_bank_details, upload_student_setup_by_fields } from '../../../axios/student';
import Actions from '../../common/Actions';
import _ from "lodash";
import { compareStates } from '../../../utils/common';
import Input from '../../common/Input';
import { MandatoryFieldLabel } from '../../tutor/TutorSetup';
import Select from '../../common/Select';

function BankDetails() {
    let [AccountName, set_acct_name] = useState(null)
    const [errors, setErrors] = useState({})

    let [PaymentType, set_acct_type] = useState(null)
    let [BankName, set_bank_name] = useState(null)
    let [AccountNumber, set_acct] = useState(null)
    let [RoutingNumber, set_routing] = useState(null)
    let [PaymentOption, set_payment_option] = useState(null)
    const { student } = useSelector(state => state.student)
    const [email, set_email] = useState(student.Email);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [creditDebitState, setCreditDebitState] = useState({
        number: "",
        name: "",
        expiry: "",
        cvc: "",
        focus: "",
        add1: "",
        add2: "",
        city: "",
        zip: "",
        country: "",
        state: ""
    })
    const [dbState, setDbState] = useState({})
    const AcademyId = localStorage.getItem('student_user_id');
    const [UnSavedChanges, setUnSavedChanges] = useState();
    console.log(student, creditDebitState)
    useEffect(() => { set_email(student.Email) }, [student])
    useEffect(() => {
        console.log("render")
        setCreditDebitState({
            ...creditDebitState, add1: student.Address1, add2: student.Address2,
            city: student.City, zip: student.ZipCode, state: student.State, country: student.Country
        });
    }, [student.ZipCode, student.State, student.Country, student.Address1, student.Address2, student.City])

    const fetchBankDetails = async () => {
        const data = await get_bank_details(AcademyId)
        if (data?.length) {
            const result = data[0];
            setDbState(result)
            set_acct_name(result.AccountName);
            set_acct_type(result.PaymentType);
            set_bank_name(result.BankName);
            set_acct(result.AccountNumber);
            set_routing(result.RoutingNumber);
            set_payment_option(result.PaymentOption);
            setCreditDebitState({...creditDebitState,
                number: result.CD_Number || '',
                cvc: result.CD_Cvc || '',
                name: result.CD_Name || '',
                expiry: result.CD_Expiry || ''
            })
            set_email(result.Email)
        }
    }

    useEffect(() => {
        fetchBankDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateCreditDebitInfo = () => {
        const firstTwoNumbers = creditDebitState.number.substring(0, 2)
        if (firstTwoNumbers === '47') {
            if (creditDebitState.number.length !== 16) {
                toast.warning('Visa card number length should be 16')
                return false
            }
            if (creditDebitState.cvc.length !== 3) {
                toast.warning('Visa Card CVC length must be 3 digitd')
                return false
            }
        }
        if (firstTwoNumbers === '51' || firstTwoNumbers === '57') {
            if (creditDebitState.number.length !== 16) {
                toast.warning('Visa card number length should be 16')
                return false
            } if (creditDebitState.cvc.length !== 3) {
                toast.warning('Visa Card CVC length must be 3 digitd')
                return false
            }
        }
        if (firstTwoNumbers === '37') {
            if (creditDebitState.number.length !== 15) {
                toast.warning('Visa card number length must be 15')
                return false
            } if (creditDebitState.cvc.length !== 4) {
                toast.warning('Visa Card CVC length must be 4 digitd')
                return false
            }
        }
        return true
    }

    const onSave = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const allNull = _.every(errors, _.isNull);
            if (!allNull) return

            if (validateCreditDebitInfo()) {
                const data = await post_bank_details({
                    Email: email,
                    CD_Name: creditDebitState.name,
                    CD_Expiry: creditDebitState.expiry,
                    CD_Number: creditDebitState.number,
                    CD_Cvc: creditDebitState.cvc,
                    PaymentOption,
                    PaymentType,
                    AccountName,
                    BankName,
                    AccountNumber,
                    RoutingNumber,
                    AcademyId,
                })
                const res = await upload_student_setup_by_fields(student.AcademyId,
                    { Address1: creditDebitState.add1, Address2: creditDebitState.add2 })
                console.log(res)
                if (data?.response?.status === 400)
                    toast.error('Error Saving the data')
                else {
                    fetchBankDetails();
                    setEditMode(false)
                    toast.success('Data saved succesfully')
                }
            }
        }
        catch (err) {

        }
        finally {
            setLoading(false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const currentState = {
        "AccountName": AccountName,
        "BankName": BankName,
        "AccountNumber": AccountNumber,
        "RoutingNumber": RoutingNumber,
        "PaymentOption": PaymentOption,
        "PaymentType": PaymentType,
        "CD_Name": creditDebitState.name,
        "CD_Expiry": creditDebitState.expiry,
        "CD_Number": creditDebitState.number,
        "CD_Cvc": creditDebitState.cvc,
        "Email": email
    }

    useEffect(() => {
        setUnSavedChanges(compareStates(dbState, currentState))
    }, [dbState, currentState])

    const handleOptionChange = (e) => {
        set_payment_option(e.target.value);
    }

    const emailPaymentOptions = ['paypal', 'payoneer', 'zelle', 'wise']

    return (
        <div className='container mt-4'>
            <form onSubmit={onSave}>
                <div className='' style={{ fontWeight: "bold" }}>
                    <MandatoryFieldLabel text={"Select Payment Option"} />
                </div>
                <div className='mb-3'>
                    <div className="form-check form-check-inline d-flex flex-column" style={{ gap: "20px" }}>
                        <div>

                            <div className="form-check form-check-inline">
                                <input disabled={!editMode} required
                                    className="form-check-input border border-dark"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    value="ach"
                                    checked={PaymentOption === "ach"}
                                    onChange={handleOptionChange}
                                    id='ach'
                                />
                                <label className="form-check-label" htmlFor='ach'>
                                    Direct Deposit (ACH)
                                </label>
                            </div>

                        </div>
                        <div>
                            <div className='form-check form-check-inline'>

                                <input disabled={!editMode} required
                                    className="form-check-input border border-dark"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    value="paypal"
                                    checked={PaymentOption === "paypal"}
                                    onChange={handleOptionChange}
                                    id="paypal"
                                />
                                <label className="form-check-label" htmlFor='paypal'>
                                    PayPal
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input disabled={!editMode} required
                                    className="form-check-input border border-dark"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    value="zelle"
                                    checked={PaymentOption === "zelle"}
                                    onChange={handleOptionChange}
                                    id={'zelle'}
                                />
                                <label className="form-check-label" htmlFor={'zelle'}>
                                    Zelle
                                </label>
                            </div>

                            <div className="form-check form-check-inline">
                                <input disabled={!editMode} required
                                    className="form-check-input border border-dark"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    value="payoneer"
                                    checked={PaymentOption === "payoneer"}
                                    onChange={handleOptionChange}
                                    id={'payoneer'}
                                />
                                <label className="form-check-label" htmlFor={'payoneer'} >
                                    Payoneer
                                </label>
                            </div>

                            <div className="form-check form-check-inline">
                                <input disabled={!editMode} required
                                    className="form-check-input border border-dark"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    value="wise"
                                    checked={PaymentOption === "wise"}
                                    onChange={handleOptionChange}
                                    id='wise'
                                />
                                <label className="form-check-label" htmlFor='wise'>
                                    Wise
                                </label>
                            </div>

                            <div className="form-check form-check-inline">
                                <input disabled={!editMode} required
                                    className="form-check-input border border-dark"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    value="credit/debit"
                                    checked={PaymentOption === "credit/debit"}
                                    onChange={handleOptionChange}
                                    id='credit/debit'
                                />
                                <label className="form-check-label" htmlFor='credit/debit'>
                                    Credit/Debit (3% transaction fee)
                                </label>
                            </div>
                        </div>
                    </div>

                </div>
                {emailPaymentOptions.includes(PaymentOption) &&
                    <div className='form-row row mb-2'>
                        <div className='form-group col-6'>
                            <div className='row input-group'>
                                <Input
                                    label={<MandatoryFieldLabel text="Email" editMode={editMode} />}
                                    value={email}
                                    setValue={set_email}
                                />

                            </div>
                        </div>
                    </div>}

                {PaymentOption === 'ach' && <>
                    <div className='form-row row mb-2'>
                        <div className='form-group col-6'>
                            <div className='row input-group'>
                                <Input
                                    value={AccountName}
                                    setValue={set_acct_name}
                                    editMode={editMode}
                                    label={<MandatoryFieldLabel text={"Account Name"} editMode={editMode} />}
                                />
                            </div>
                        </div>

                        <div className='form-group col-6'>
                            <div className='row input-group'>
                                <Select
                                    value={PaymentType}
                                    editMode={editMode}
                                    label={<MandatoryFieldLabel text={"Payment Type"} editMode={editMode} />}
                                    setValue={set_acct_type}
                                >
                                    <option value="null">Select Account Type</option>
                                    <option value="savings">Savings</option>
                                    <option value="checking">Checking</option>

                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className='form-row row mb-2'>
                        <div className='form-group col'>
                            <div className='row input-group'>
                                <Input
                                    value={BankName}
                                    setValue={set_bank_name}
                                    editMode={editMode}
                                    label={<MandatoryFieldLabel text={"Bank Name"} editMode={editMode} />}
                                />
                            </div>
                        </div>

                        <div className='form-group col'>
                            <div className='row input-group'>
                                <Input
                                    value={AccountNumber}
                                    setValue={set_acct}
                                    editMode={editMode}
                                    label={<MandatoryFieldLabel text={"Account Number"} editMode={editMode} />}
                                />

                            </div>
                        </div>
                    </div>

                    <div className='form-row row mb-2'>
                        <div className='form-group w-50'>
                            <div className='row input-group'>
                                <Input
                                    value={RoutingNumber}
                                    setValue={set_routing}
                                    editMode={editMode}
                                    label={<MandatoryFieldLabel text={"Routing Number"} editMode={editMode} />}
                                />
                            </div>
                        </div>
                    </div>
                </>}

                {PaymentOption === 'credit/debit' &&
                    <PaymentForm creditDebitState={creditDebitState}
                        setCreditDebitState={setCreditDebitState}
                        editMode={editMode}
                        errors={errors}
                        setErrors={setErrors}
                    />
                }

                <Actions
                    onEdit={() => setEditMode(true)}
                    saveDisabled={!editMode}
                    editDisabled={editMode}
                    loading={loading}
                    unSavedChanges={UnSavedChanges}
                />
            </form>
        </div>
    );
}

export default BankDetails;
