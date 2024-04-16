import { useEffect, useState } from "react";
import { get_student_market_data } from "../../axios/student";

const Ads = () => {

    let [screen_name, set_screen_name] = useState('')
    let [grade, set_grade] = useState('')
    let [lang, set_lang] = useState('')
    let [country, set_country] = useState('')


    let [education_list, set_education_list] = useState([])
    let [exprience_list, set_exprience_list] = useState([])
    let [certificate_list, set_certificate_list] = useState([])
    let [faculty_list, set_faculty_list] = useState([])
    let [subject_list, set_subject_list] = useState([])
    let [subject, set_subject] = useState([])

    let [activeFaculty, setActiveFaculty] = useState('')


    let [price_max, set_price_max] = useState(0)
    //let [range_max, set_range_max] = useState(range_min)


    useEffect(() => {
        console.log(activeFaculty)

        let list = subject.filter(item => item.FacultyId === activeFaculty)

        set_subject_list(list)
    }, [activeFaculty, subject])


    useEffect(() => {

        if (window.localStorage.getItem('student_user_id') !== null) {
            get_student_market_data(window.localStorage.getItem('student_user_id'))
                .then((result) => {
                    if (!result?.response?.data) {
                        const { StudentData, EducationalLevel, Exprience, CertificateTypes,
                            Subjects, Faculty } = result
                        set_screen_name(StudentData[0].ScreenName)
                        set_grade(StudentData[0].Grade)
                        set_country(StudentData[0].Country)
                        set_lang(StudentData[0].Language)

                        set_education_list(EducationalLevel)
                        set_certificate_list(CertificateTypes)
                        set_exprience_list(Exprience)
                        set_subject(Subjects)
                        set_subject_list([])
                        set_faculty_list(Faculty)
                    }
                })
                .catch(err => console.log(err))
        }
    }, [])

    useEffect(() => {
        document.querySelector('#price-max').value = price_max + 1
    }, [price_max])


    return (
        <>
            <div className="student-market-place-cnt">


                <div className="student-market-place-report-ad">
                    <input style={{ width: '20px', height: '20px', margin: '0' }} type="checkbox" name="" id="reportAd" />
                    &nbsp;
                    <label htmlFor="reportAd"><b>Publish This Ad</b></label>
                </div>



                <br />

                <div className="student-market-place-body">


                    <div className="student-market-place-body-form">
                        <div className="input-cnt">
                            <label htmlFor="">My Screen ID</label>
                            <input defaultValue={screen_name} type="text" name="" id="Ad" />
                        </div>

                        <div className="input-cnt">
                            <label htmlFor="">My School Grade</label>
                            <input defaultValue={grade} type="text" name="" id="Ad" />
                        </div>

                        <div className="input-cnt">
                            <label htmlFor="">My Country</label>
                            <input defaultValue={country} type="text" name="" id="Ad" />
                        </div>

                        <div className="input-cnt">
                            <label htmlFor="">My Language</label>

                            <input defaultValue={lang} type="text" name="" id="Ad" />
                        </div>


                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">Need Help From Faculty</label>
                            <select onInput={e => setActiveFaculty(e.target.value.split('-')[1])}>
                                <option value={''}>Select Faculty</option>
                                {
                                    faculty_list.map(item => {
                                        return (
                                            <option value={`${item.Faculty}-${item.Id}`}>{item.Faculty}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">Subject</label>
                            <select>
                                <option value={''}>Select</option>
                                {
                                    subject_list.map(item => {
                                        return (
                                            <option value={item.SubjectName}>{item.SubjectName}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className="input-cnt" style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                            <label htmlFor="">Price Range</label>
                            <input style={{ width: '30%' }} onInput={e => set_price_max(parseInt(e.target.value))} defaultValue={0} min={0} type="number" name="" id="Ad" />
                            &nbsp; <b>To</b> &nbsp;
                            <input style={{ width: '30%' }} min={price_max + 1} defaultValue={price_max + 1} type="number" name="" id="price-max" />
                        </div>

                    </div>



                    <div className="student-market-place-btm-form">
                        <h4>Tutor's Requirements</h4>
                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">Educational Level</label>
                            <select>
                                <option value={''}>Select</option>
                                {
                                    education_list.map(item => {
                                        return (
                                            <option value={item.Level}>{item.Level}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>


                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">Teaching Experience</label>
                            <select>
                                <option value={''}>Select</option>
                                {
                                    exprience_list.map(item => {
                                        return (
                                            <option value={item.TutorExperience}>{item.TutorExperience}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">Tutor's Certificate</label>
                            <select>
                                <option value={''}>Select</option>
                                {
                                    certificate_list.map(item => {
                                        return (
                                            <option value={item.CertificateType}>{item.CertificateType}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>


                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">Tutor's Language</label>
                            <select>
                                <option value={''}>Select</option>
                                {

                                }
                            </select>
                        </div>

                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">UTC (Tutor's time zone)</label>

                            <input style={{ width: '300px' }} min={0} max={12} defaultValue={0} type="number" name="" id="Ad" />

                        </div>


                        <textarea style={{ height: '100px', width: '400px' }}></textarea>

                    </div>


                    <div className="student-market-place-buttons">
                        <div className="input-cnt">
                            <input style={{ width: '20px', height: '20px', margin: '0' }} type="checkbox" name="" id="" />
                            &nbsp;&nbsp;
                            <label htmlFor=""><b>Let the system find my tutor</b></label>
                        </div>

                        <div className="student-market-place-btns">
                            <button style={{ background: 'red', color: '#fff' }}>Delete Ad</button>
                            <button style={{ background: 'Green', color: '#fff' }}>Submit Ad</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Ads;