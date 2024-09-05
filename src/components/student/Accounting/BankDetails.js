import React, { useEffect, useState } from 'react';
import PaymentForm from '../../common/PaymentForm';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { get_bank_details, post_bank_details, upload_student_setup_by_fields } from '../../../axios/student';
import Actions from '../../common/Actions';
import _ from "lodash";
import { compareStates } from '../../../utils/common';
import Input from '../../common/Input';
import { MandatoryFieldLabel } from '../../tutor/TutorSetup';
import Select from '../../common/Select';
import { setStudent } from '../../../redux/student/studentData';

function BankDetails() {
    let [AccountName, set_acct_name] = useState(null)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    let [PaymentType, set_acct_type] = useState(null)
    let [BankName, set_bank_name] = useState(null)
    let [AccountNumber, set_acct] = useState(null)
    let [RoutingNumber, set_routing] = useState(null)
    let [PaymentOption, set_payment_option] = useState(null)
    const { student } = useSelector(state => state.student)
    const [email, set_email] = useState(student.Email);
    const [loading, setLoading] = useState(false);
    const [card, setCard] = useState("primary")
    const [editMode, setEditMode] = useState(false);
    const [creditDebitState, setCreditDebitState] = useState({
        number_p: "",
        name_p: "",
        expiry_p: "",
        cvc_p: "",
        number_s: "",
        name_s: "",
        expiry_s: "",
        cvc_s: "",
        focus: "",
        add1: "",
        add2: "",
        city: "",
        zip: "",
        country: "",
        state: ""
    })
    const [dbState, setDbState] = useState({})
    const AcademyId = student.AcademyId;
    const [UnSavedChanges, setUnSavedChanges] = useState();

    useEffect(() => { set_email(student.Email) }, [student])

    const fetchBankDetails = async (id) => {
        const data = await get_bank_details(id)

        if (data?.length) {
            const result = data[0];
            setDbState(result)
            set_acct_name(result.AccountName);
            set_acct_type(result.PaymentType);
            set_bank_name(result.BankName);
            set_acct(result.AccountNumber);
            set_routing(result.RoutingNumber);
            set_payment_option(result.PaymentOption);
            setCreditDebitState({
                add1: student.Address1,
                add2: student.Address2,
                city: student.City,
                zip: student.ZipCode,
                state: student.State,
                country: student.Country,
                number_p: result.CD_Number_Pri || '',
                cvc_p: result.CD_Cvc_Pri || '',
                name_p: result.CD_Name_Pri || '',
                expiry_p: result.CD_Expiry_Pri || '',
                number_s: result.CD_Number_Sec || '',
                cvc_s: result.CD_Cvc_Sec || '',
                name_s: result.CD_Name_Sec || '',
                expiry_s: result.CD_Expiry_Sec || ''
            })
            set_email(result.Email)
        }
        else {
            setCreditDebitState({
                ...creditDebitState,
                add1: student.Address1,
                add2: student.Address2,
                city: student.City,
                zip: student.ZipCode,
                state: student.State,
                country: student.Country,
            })
        }
    }

    useEffect(() => {
       student.AcademyId && fetchBankDetails(student.AcademyId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [student]);

    const validateCreditDebitInfo = (cardType) => {
        const cardNumber = cardType === "primary" ? creditDebitState.number_p : creditDebitState.number_s;
        const cardCvc = cardType === "primary" ? creditDebitState.cvc_p : creditDebitState.cvc_s;
        const firstTwoNumbers = cardNumber.substring(0, 2);

        if (firstTwoNumbers === '47') {
            if (cardNumber.length !== 16) {
                toast.warning('Visa card number length should be 16');
                return false;
            }
            if (cardCvc.length !== 3) {
                toast.warning('Visa Card CVC length must be 3 digits');
                return false;
            }
        }
        if (firstTwoNumbers === '51' || firstTwoNumbers === '57') {
            if (cardNumber.length !== 16) {
                toast.warning('MasterCard number length should be 16');
                return false;
            }
            if (cardCvc.length !== 3) {
                toast.warning('MasterCard CVC length must be 3 digits');
                return false;
            }
        }
        if (firstTwoNumbers === '37') {
            if (cardNumber.length !== 15) {
                toast.warning('Amex card number length must be 15');
                return false;
            }
            if (cardCvc.length !== 4) {
                toast.warning('Amex Card CVC length must be 4 digits');
                return false;
            }
        }
        return true;
    };

    const onSave = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const allNull = _.every(errors, _.isNull);
            if (!allNull) return toast("Please fix Errors")

            if (validateCreditDebitInfo()) {
                const data = await post_bank_details({
                    Email: email,
                    CD_Name_Pri: creditDebitState.name_p,
                    CD_Expiry_Pri: creditDebitState.expiry_p,
                    CD_Number_Pri: creditDebitState.number_p,
                    CD_Cvc_Pri: creditDebitState.cvc_p,
                    CD_Name_Sec: creditDebitState.name_s,
                    CD_Expiry_Sec: creditDebitState.expiry_s,
                    CD_Number_Sec: creditDebitState.number_s,
                    CD_Cvc_Sec: creditDebitState.cvc_s,
                    PaymentOption,
                    PaymentType,
                    AccountName,
                    BankName,
                    AccountNumber,
                    RoutingNumber,
                    AcademyId,
                })
                await upload_student_setup_by_fields(student.AcademyId,
                    {
                        Address1: creditDebitState.add1,
                        Address2: creditDebitState.add2,
                        City: creditDebitState.city,
                        ZipCode: creditDebitState.zip,
                        State: creditDebitState.state,
                        Country: creditDebitState.country,
                    })
                dispatch(setStudent({
                    ...student, Address1: creditDebitState.add1,
                    Address2: creditDebitState.add2,
                    City: creditDebitState.city,
                    ZipCode: creditDebitState.zip,
                    State: creditDebitState.state,
                    Country: creditDebitState.country
                }))

                if (data?.response?.status === 400)
                    toast.error('Error Saving the data')
                else {
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
        "CD_Name_Pri": creditDebitState.name_p,
        "CD_Expiry_Pri": creditDebitState.expiry_p,
        "CD_Number_Pri": creditDebitState.number_p,
        "CD_Cvc_Pri": creditDebitState.cvc_p,
        "CD_Name_Sec": creditDebitState.name_s,
        "CD_Expiry_Sec": creditDebitState.expiry_s,
        "CD_Number_Sec": creditDebitState.number_s,
        "CD_Cvc_Sec": creditDebitState.cvc_s,
        "Email": email,
        "Address1": creditDebitState.add1,
        "Address2": creditDebitState.add2,
        "City": creditDebitState.city,
        "ZipCode": creditDebitState.zip,
        "State": creditDebitState.state,
        "Country": creditDebitState.country,
    }

    useEffect(() => {
        setUnSavedChanges(compareStates({
            ...dbState,
            "Address1": student.Address1,
            "Address2": student.Address2,
            "City": student.City,
            "ZipCode": student.ZipCode,
            "State": student.State,
            "Country": student.Country,
        }, currentState))
    }, [dbState, currentState, student])

    // const setupFields = {
    //     "Address1": creditDebitState.add1,
    //     "Address2": creditDebitState.add2,
    //     "City": creditDebitState.city,
    //     "ZipCode": creditDebitState.zip,
    //     "State": creditDebitState.state,
    //     "Country": creditDebitState.country,
    // }

    // const setupDbState = {
    //     "Address1": student.Address1,
    //     "Address2": student.Address2,
    //     "City": student.City,
    //     "ZipCode": student.ZipCode,
    //     "State": student.State,
    //     "Country": student.Country,
    // }

    // useEffect(()=>{
    //     setUnSavedChanges(compareStates(setupDbState, setupFields))
    // },[setupDbState, setupFields])

    const handleOptionChange = (e) => {
        set_payment_option(e.target.value);
    }

    const emailPaymentOptions = ['paypal', 'payoneer', 'zelle', 'wise']

    return (
        <div style={{ background: editMode ? "initial" : "#e9ecef", height:"calc(100vh - 180px)" }} >
            <div className='container rounded'>
                <form onSubmit={onSave}>
                    <div className='' style={{ fontWeight: "bold" }}>
                        <MandatoryFieldLabel text={"Select Payment Option"} editMode={editMode} />
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
                                <div className="form-check form-check-inline">
                                    <input disabled={!editMode} required
                                        className="form-check-input border border-dark"
                                        type="radio"
                                        name="inlineRadioOptions"
                                        value="cd"
                                        checked={PaymentOption === "cd"}
                                        onChange={handleOptionChange}
                                        id='credit/debit/p'
                                    />
                                    <label className="form-check-label" htmlFor='credit/debit/p'>
                                        Credit/Debit
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

                                {/* <div className="form-check form-check-inline">
                                <input disabled={!editMode} required
                                    className="form-check-input border border-dark"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    value="cd-secondary"
                                    checked={PaymentOption === "cd-secondary"}
                                    onChange={handleOptionChange}
                                    id='credit/debit/s'
                                />
                                <label className="form-check-label" htmlFor='credit/debit/s'>
                                    Credit/Debit (3% transaction fee) (Secondary)
                                </label>
                            </div> */}
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
                                        <option value="" disabled>Select Account Type</option>
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

                    {PaymentOption === 'cd' &&
                        <PaymentForm creditDebitState={creditDebitState}
                            card={card}
                            setCreditDebitState={setCreditDebitState}
                            editMode={editMode}
                            errors={errors}
                            setCard={setCard}
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
        </div>
    );
}

export default BankDetails;
