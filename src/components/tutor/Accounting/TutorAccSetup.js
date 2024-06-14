import { useEffect, useState } from 'react';

import { get_bank_details, post_tutor_setup, upload_tutor_bank } from '../../../axios/tutor';
import { showDate } from '../../../utils/moment';
import AcadCommission from './Acad_Commission._Table';
import Actions from '../../common/Actions'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { COMMISSION_DATA, monthFormatWithYYYY } from '../../../constants/constants';
import { compareStates, showRevisitToast } from '../../../utils/common';
import { setTutor } from '../../../redux/tutor/tutorData';
import Tooltip from '../../common/ToolTip';
import Input from '../../common/Input';
import { MandatoryFieldLabel } from '../TutorSetup';
import Select from '../../common/Select';

const TutorAccSetup = ({ sessions, currentYearAccHours, currentYearEarning, previousYearEarning }) => {
    const { tutor } = useSelector(state => state.tutor)
    const [email, set_email] = useState(tutor.Email);
    let [acct_name, set_acct_name] = useState(null)
    let [acct_type, set_acct_type] = useState(null)
    let [bank_name, set_bank_name] = useState(null)
    let [acct, set_acct] = useState(null)
    let [routing, set_routing] = useState(null)
    let [ssh, set_ssh] = useState(null)
    let [payment_option, set_payment_option] = useState(null)
    const [saving, setSaving] = useState(false)
    const [dbValues, setDBValues] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [unSavedChanges, setUnSavedChanges] = useState(false);
    const dispatch = useDispatch();

    const emailRequiredPaymentMethods = ['Paypal', 'Payoneer', 'Wise', 'Zelle']

    useEffect(() => {
        !email?.length && set_email(tutor.Email)
    }, [tutor, email])

    useEffect(() => {
        if (!dbValues.AcademyId) setEditMode(true)
        else setEditMode(false)
    }, [dbValues])

    const commissionAccordingtoNumOfSession = (sr) => {
        const commissionEntry = COMMISSION_DATA.find(entry => {
            if (!entry.higher) {
                return sr >= entry.lower && sr <= entry.higher;
            } else {
                return sr >= entry.lower;
            }
        });
        return commissionEntry ? commissionEntry.percent : null
    }

    const validate = () => {
        const fields = { SSH: { value: ssh, pattern: /^\d{3}-\d{2}-\d{4}$/ } };

        if (fields.SSH.value?.length && !fields.SSH.pattern.test(fields.SSH.value)) {
            toast.warning('Please follow XXX-XX-XXXX format for Social Security Number');
            return false
        }
        return true
    }

    let saver = async (e) => {
        e.preventDefault()

        let user_id = window.localStorage.getItem('tutor_user_id');
        let Step = null;
        if (!dbValues.AcademyId) Step = 5
        if (validate()) setSaving(true);

        if (payment_option === 'Bank') {
            let response = await upload_tutor_bank(email, acct_name, acct_type, bank_name, acct, routing, ssh, payment_option, user_id);
            fetchingTutorBankRecord();
            if (Step) {
                await post_tutor_setup({
                    Step, fname: tutor.FirstName,
                    lname: tutor.LastName, mname: tutor.MiddleName, userId: tutor.userId
                })
                dispatch(setTutor())
            }
            if (response) {
                toast.success("Succesfully Saved The Bank Info.")
                showRevisitToast()

                setEditMode(false)
            } else {
                toast.error("Error while Saving the Bank Info.")
            }
        } else {
            let response = await upload_tutor_bank(email, acct_name, acct_type, bank_name, acct, routing, ssh, payment_option, user_id);
            fetchingTutorBankRecord();
            if (Step) {
                await post_tutor_setup({
                    Step, fname: tutor.FirstName,
                    lname: tutor.LastName, mname: tutor.MiddleName, userId: tutor.userId
                })
                dispatch(setTutor())
            }
            if (response) {
                showRevisitToast()

                toast.success("Succesfully Saved The Bank Info.");
                setEditMode(false)
            } else {
                toast.error("Error while Saving the Bank Info.")
            }
        }
        setSaving(false);
    }

    const fetchingTutorBankRecord = async () => {
        const result = await get_bank_details(window.localStorage.getItem('tutor_user_id'));
        if (result?.[0]) {
            const data = result[0]
            setDBValues({
                AcademyId: data.AcademyId,
                PaymentOption: data.PaymentOption,
                SSH: data.SSH === "null" ? null : data.SSH,
                Routing: data.Routing === "null" ? null : data.Routing,
                AccountName: data.AccountName === 'null' ? null : data.AccountName,
                AccountType: data.AccountType === "null" ? null : data.AccountType,
                BankName: data.BankName === "null" ? null : data.BankName,
                Account: data.Account === "null" ? null : data.Account,
                Email: data.Email,
            })
            set_payment_option(data.PaymentOption);
            set_routing(data.Routing === "null" ? null : data.Routing)
            set_ssh(data.SSH === "null" ? null : data.SSH)
            set_acct_name(data.AccountName === "null" ? null : data.AccountName)
            set_acct_type(data.AccountType === "null" ? null : data.AccountType)
            set_bank_name(data.BankName === "null" ? null : data.BankName)
            set_acct(data.Account === "null" ? null : data.Account)
            set_email(data.Email)
        }
    }

    //fetching
    useEffect(() => {
        fetchingTutorBankRecord()
    }, [])

    //compare db and local
    useEffect(() => {
        let localState;
        if (!dbValues.AcademyId) localState = {
            Email: dbValues.Email ? dbValues.Email : tutor.Email,
            AccountName: null,
            AccountType:
                null,
            BankName: null,
            Account: null,
            Routing: null,
            SSH: null,
            PaymentOption: null,
        }
        else {
            localState = {
                Email: email,
                AccountName: acct_name,
                AccountType: acct_type,
                BankName: bank_name,
                Account: acct,
                Routing: routing,
                SSH: ssh,
                PaymentOption: payment_option,
            }
        }
        setUnSavedChanges(compareStates(dbValues, localState))
    }, [dbValues, acct_name, acct_type, acct, bank_name, ssh, email, routing, payment_option, tutor])

    const mandatoryFields = [{ name: "paymentOption", filled: !!payment_option?.length },
    { name: "accName", filled: !!acct_name?.length },
    { name: "acc#", filled: !!acct?.length },
    { name: "routing#", filled: !!routing?.length },
    { name: "accType", filled: !!acct_type?.length },
    { name: "bankName", filled: !!bank_name?.length },
    { name: "email", filled: !!email?.length }]

    return (
        <div className="d-flex" style={{ height: "calc(100vh - 150px)", overflowY: "auto" }}>

            <div className="d-flex col-md-3 border h-100 p-2">

                <div className="d-flex flex-column">
                    <div className="highlight m-0" >
                        At our tutoring academy, the service charge is determined by the total hours accumulated annually. The system is designed to reward
                        frequent tutoring; thus, the more hours you tutor, the lower your the service charge the academy will be. The calculation of your hours
                        begins with the first lesson you conduct each year, ensuring a fair and transparent billing cycle.r.
                    </div>
                    <div className='p-3'>
                        <div className='d-flex align-items-center mb-2 justify-content-between'>
                            <h6 className='m-0 text-start '>Tutor's Start Day (First tutoring lesson)</h6>
                            <p className="border px-4  py-2 rounded m-2 col-4">{!!sessions.length ?
                                showDate(sessions?.[sessions.length - 1]?.start, monthFormatWithYYYY) : 'N/A'}</p>
                        </div>

                        <AcadCommission />
                    </div>

                </div>
            </div>
            <form onSubmit={saver} className='d-flex h-100'>
                <div className="col-md-8 border h-100 p-2">
                    <div className="highlight" style={{ height: '150px' }}>
                        Our tutoring academy issues payments bi-weekly, every second Friday, for the lessons conducted up to the preceding Friday at midnight (GMT-5). We kindly ask you to choose your preferred method of payment from the options listed below. Please note that once the payment is processed, it may take 1-3 business days for the funds to be available in your account. We appreciate your understanding and are committed to ensuring a smooth and timely payment process.
                    </div>
                    <div className='p-3 ' style={{ fontWeight: "bold" }}>

                        <MandatoryFieldLabel text={'How do you want to be paid?'} name="paymentOption" mandatoryFields={mandatoryFields} />

                        <div className='d-flex align-items-center justify-content-start flex-wrap' style={{ gap: "20px" }}>
                            {tutor.Country === 'USA' && <div className=' w-100 d-block' style={{ float: 'left' }}>
                                <input disabled={!editMode} className='m-0'
                                    checked={payment_option === 'Bank'}
                                    style={{
                                        float: 'left', width: '30px', cursor: 'pointer', height: '20px',
                                        fontSize: 'x-small'
                                    }} type="radio" value='Bank'
                                    onChange={(e) => set_payment_option(e.target.value)} name='p-method' id="" />
                                <span className='m-0'>Direct Deposit Bank account (ACH)</span>
                            </div>}
                            <div style={{ float: 'left' }}>
                                <input disabled={!editMode} required
                                    checked={payment_option === 'Paypal'}
                                    style={{
                                        float: 'left', width: '30px', cursor: 'pointer', height: '20px',
                                        fontSize: 'x-small'
                                    }}
                                    type="radio"
                                    onChange={(e) => set_payment_option(e.target.value)}
                                    className='m-0'
                                    value='Paypal' name='p-method' id="" />
                                <span className='m-0'>Paypal</span>
                            </div>
                            <div style={{ float: 'left' }}>
                                <input disabled={!editMode} required
                                    checked={payment_option === 'Wise'}
                                    style={{
                                        float: 'left', width: '30px', cursor: 'pointer',
                                        height: '20px',
                                        fontSize: 'x-small'
                                    }}
                                    type="radio"
                                    onChange={(e) => set_payment_option(e.target.value)}
                                    className='m-0'
                                    value='Wise' name='p-method' />
                                <span className='m-0'>Wise</span>
                            </div>
                            <div style={{ float: 'left' }}>
                                <input disabled={!editMode} required
                                    checked={payment_option === 'Payoneer'}
                                    style={{
                                        float: 'left', width: '30px', cursor: 'pointer',
                                        height: '20px',
                                        fontSize: 'x-small'
                                    }}
                                    type="radio"
                                    onChange={(e) => set_payment_option(e.target.value)}
                                    className='m-0'
                                    value='Payoneer' name='p-method' />
                                <span className='m-0'>Payoneer</span>
                            </div>
                            <div style={{ float: 'left' }}>
                                <input disabled={!editMode} className='m-0'
                                    checked={payment_option === 'Zelle'}
                                    style={{
                                        float: 'left', width: '30px', cursor: 'pointer', height: '20px',
                                        fontSize: 'x-small'
                                    }} type="radio"
                                    onChange={(e) => set_payment_option(e.target.value)} value='Zelle' name='p-method' id="" />
                                <span className='m-0'>Zelle</span>
                            </div>


                        </div>

                        {!!payment_option &&
                            <div className='m-5'>
                                {emailRequiredPaymentMethods.includes(payment_option) && <p
                                    style={{
                                        fontWeight: "bold"
                                    }}>3% service charge imposed by the services listed above.
                                    <Tooltip width='200px' text={'Payoneer, Paypal, Zelle, Wise'} /></p>}

                                {payment_option === "Bank" &&
                                    <div className=' shadow p-3 border border-2 '>

                                        <div className='d-flex align-items-center justify-content-between flex-wrap' style={{ gap: "10px" }}>
                                            <div style={{ width: "48%" }}>
                                                <Input
                                                    value={acct_name}
                                                    setValue={set_acct_name}
                                                    editMode={editMode}
                                                    label={<MandatoryFieldLabel text="Account Name" name={"accName"} mandatoryFields={mandatoryFields} />}
                                                />
                                            </div>
                                            <div style={{ width: "48%" }}>
                                                <Select
                                                    editMode={editMode}
                                                    value={acct_type}
                                                    setValue={set_acct_type}
                                                    label={<MandatoryFieldLabel text={"Account Type"} name="accType" mandatoryFields={mandatoryFields} />}
                                                >
                                                    <option value="">Select Account Type</option>
                                                    <option value="savings">Savings</option>
                                                    <option value="checking">Checking</option>

                                                </Select>
                                            </div>
                                            <div style={{ width: "48%" }}>
                                                <Input
                                                    value={bank_name}
                                                    setValue={set_bank_name}
                                                    editMode={editMode}
                                                    label={<MandatoryFieldLabel text="Bank Name" name="bankName" mandatoryFields={mandatoryFields} />}
                                                />
                                            </div>
                                            {/* <label htmlFor="acct-name">Account Name</label>
                                            <input disabled={!editMode} required type="text" className='form-control' 
                                            onInput={e => set_acct_name(e.target.value)} id="acct-name" 
                                            defaultValue={acct_name} style={{ float: 'right', width: '60%' }} /> */}
                                            <div style={{ width: "48%" }}>

                                                <Input
                                                    value={routing}
                                                    setValue={set_routing}
                                                    editMode={editMode}
                                                    label={<MandatoryFieldLabel text="Routing#" name="routing#" mandatoryFields={mandatoryFields} />}
                                                /></div>

                                            {/* <label htmlFor="bank-name">Bank Name</label>
                                            <input disabled={!editMode} className='form-control' required type="text"
                                             onInput={e => set_bank_name(e.target.value)} defaultValue={bank_name} id="bank-name" 
                                             style={{ float: 'right', width: '60%' }} /> */}
                                            <div style={{ width: "48%" }}>
                                                <Input
                                                    value={acct}
                                                    setValue={set_acct}
                                                    editMode={editMode}
                                                    label={<MandatoryFieldLabel text="Account#" mandatoryFields={mandatoryFields} name="acc#" />}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                }
                                {emailRequiredPaymentMethods.includes(payment_option) &&

                                    <div className=' shadow p-3 border border-2 '>

                                        <div className='d-flex align-items-center justify-content-between'>
                                            <Input
                                                value={email}
                                                setValue={set_email}
                                                editMode={editMode}
                                                label={<MandatoryFieldLabel text="Email" name="email" mandatoryFields={mandatoryFields} />}
                                            />
                                            {/* <label htmlFor="acct-name">Email</label>
                                            <input disabled={!editMode} required type="email" className='form-control'
                                                onInput={e => { set_email(e.target.value) }}
                                                id="acct-name" value={email}
                                                style={{ float: 'right', width: '60%' }} /> */}
                                        </div>
                                    </div>}
                            </div>
                        }
                    </div>

                </div>

                <div className="col-md-4 border h-100 p-2">
                    <div className="highlight" style={{ height: '150px' }}>
                        Social security needs to be provided only from US residents for annual EARNING over $600.
                        Form 1099 to be issued by the academy. Therefore, no need to fill the SS number now,
                        only when your earnings exceeds $600
                    </div>
                    <div className='p-3'>

                        {tutor.Country === "USA" && <div className='d-flex align-items-center mb-2 justify-content-between'>
                            <Input
                                tooltipText='It is mandatory for tutors who are American citizens to provide their Social Security Number (SSN) to receive the annual Form 1099. This requirement ensures compliance with tax regulations and enables accurate reporting of income to the Internal Revenue Service (IRS)..'
                                editMode={editMode}
                                label={<MandatoryFieldLabel text="SS# (Social Security Number)" editMode={editMode} />}
                                required={currentYearEarning > 600}
                                setValue={set_ssh}
                                value={ssh}
                            />
                            {/* <label htmlFor="">SS# (Social Security Number) &nbsp; 
                            <Tooltip text="Tutors that are American citizens, should mandatory 
                            fill their SS# in order to receive annual form 1099." /> </label>
                            <input disabled={!editMode} className='form-control m-0 w-50'
                                onInput={e => set_ssh(e.target.value)}
                                defaultValue={ssh} type="text"
                                placeholder='XXX-XX-XXXX'
                            /> */}
                        </div>}

                        <div className='d-flex align-items-center mb-2 justify-content-between'>
                            <Input
                                tooltipText='This statement represents the total number of hours accrued annually from the commencement date of your 
                                employment.'
                                editMode={false}
                                label={"Accumulated Hours"}
                                value={`${currentYearAccHours}:00`}
                                placeholder='XXX-XX-XXXX'
                            />

                            {/* <label htmlFor="accumulated-hrs">Accumulated Hours <Tooltip text="This is the total hours accumulated every
                             year from the date of your start day" /></label>
                            <input className='form-control m-0' type="text"
                                value={`${currentYearAccHours}:00`}
                                style={{ float: 'right', width: '50%' }} disabled /> */}
                        </div>

                        <div className='d-flex align-items-center mb-2 justify-content-between'>

                            <Input
                                tooltipText='The service charge is calculated based on the table to the left. As you increase the number of hours spent tutoring, the 
                                academy offers a reduction in your service charge. This incentivizes tutors to commit more time, as they benefit from lower rates, making it a 
                                mutually beneficial arrangement.'
                                editMode={false}
                                label={"Service charge %"}
                                required={currentYearEarning > 600}
                                value={`${commissionAccordingtoNumOfSession(currentYearAccHours)} %`}
                            />
                            {/* <label >Service charge % <Tooltip text="text" /></label>
                            <input disabled className='form-control m-0' type="text"
                                style={{ float: 'right', width: '50%' }}
                            /> */}
                        </div>

                        <div className='d-flex align-items-center mb-2 justify-content-between'>
                            <Input
                                tooltipText={`The field automatically computes your total earnings annually, starting from January 1st. 
                                 This feature ensures that you have an accurate account of your income from the beginning of each year,
                                 providing a clear and comprehensive financial overview. It's a valuable tool for financial planning and tracking your 
                                 earnings progress over time`}
                                editMode={false}
                                label={`Total Earning ${(new Date()).getFullYear()}. `}
                                required={currentYearEarning > 600}
                                setValue={set_ssh}
                                value={(currentYearEarning || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                placeholder='XXX-XX-XXXX'
                            />

                            {/* <label htmlFor="total-earning">Total Earning {(new Date()).getFullYear()}. <Tooltip 
                            text="Calculate your total earnings since Jan 1st." /></label>
                            <input className='form-control m-0' type="text"
                                value={(currentYearEarning || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                id="total-earning"
                                style={{ float: 'right', width: '50%' }} disabled /> */}
                        </div>
                        <div className='d-flex align-items-center mb-2 justify-content-between'>

                            <Input
                                tooltipText='To accurately calculate your total earnings for the previous year, you can refer to your 1099 form, which reports all non-employment
                                 income. WE sum up the amounts you earned last year to determine your total earnings.'
                                editMode={false}
                                label={`Total Earning Previous Year. `}
                                required={currentYearEarning > 600}
                                value={(previousYearEarning || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            />
                            {/* <label htmlFor="total-earning">Total Earning Previous Year.
                             <Tooltip text="Calculate your total earning for the previous year. 
                            This earnings will be shopwn on your 1099 form." /></label>
                            <input className='form-control m-0' type="text"
                                value={(previousYearEarning || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                id="total-earning"
                                style={{ float: 'right', width: '50%' }} disabled /> */}
                        </div>
                    </div>

                </div>
                <Actions
                    loading={saving}
                    unSavedChanges={unSavedChanges}
                    onEdit={() => setEditMode(true)}
                    editDisabled={editMode}
                    saveDisabled={!editMode}
                />
            </form>
        </div>
    );
}

export default TutorAccSetup;