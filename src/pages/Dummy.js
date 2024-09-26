import React from 'react';
import { FaStar, FaChalkboardTeacher, FaLanguage, FaDollarSign } from 'react-icons/fa';

const ProfilePage = () => {
  // Dummy data
  const teacher = {
    name: 'John Doe',
    lectures: 120,
    headline: 'Expert Mathematics Professor',
    languages: ['English', 'Spanish'],
    hourlyRate: 50,
    ratings: 4.5,
    workExperience: '15 years of experience in teaching Mathematics at various universities.',
    education: {
      masters: 'Master of Science, Harvard University',
      bachelors: 'Bachelor of Science, Stanford University',
      professorDetails: 'Professor at MIT',
    },
    subjects: [
      { subject: 'Mathematics', grade: '2nd Year', rate: 60 },
      { subject: 'Physics', grade: '3rd Year', rate: 55 },
    ],
    videoIntro: 'https://via.placeholder.com/600x400', // Dummy video URL
  };

  // Inline styles with modern design updates
  const styles = {
    pageContainer: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: '#1E3A8A', // Denim color background
      color: '#F3F4F6', // Light gray text
      padding: '40px',
      minHeight: '100vh',
    },
    leftColumn: {
      flex: 1,
      backgroundColor: '#334155', // Dark slate color
      padding: '30px',
      marginRight: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    rightColumn: {
      flex: 2,
      backgroundColor: '#F3F4F6', // Light gray color
      padding: '30px',
      borderRadius: '12px',
      color: '#1F2937', // Dark text
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    image: {
      width: '100%',
      borderRadius: '12px',
      marginBottom: '20px',
    },
    button: {
      backgroundColor: '#2ECC71', // Parakeet color
      color: 'white',
      marginTop: '15px',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      width: '100%',
      fontSize: '16px',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#28B463',
    },
    heading: {
      marginBottom: '15px',
      fontWeight: 'bold',
    },
    subHeading: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginTop: '20px',
    },
  };

  return (
    <div className="container">
      <div className="row" style={styles.pageContainer}>
        {/* Left Column */}
        <div className="col-lg-4" style={styles.leftColumn}>
          <img src="https://via.placeholder.com/150" alt="Profile" style={styles.image} />
          <h3 style={styles.heading}>{teacher.headline}</h3>
          <p>
            <FaStar /> {teacher.ratings} Rating
          </p>
          <p>
            <FaChalkboardTeacher /> {teacher.lectures} Lectures Given
          </p>
          <p>
            <FaLanguage /> Languages: {teacher.languages.join(', ')}
          </p>
          <p>
            <FaDollarSign /> ${teacher.hourlyRate}/hour
          </p>
          <button style={styles.button}>Contact</button>
          <button style={styles.button}>Book a Session</button>
        </div>

        {/* Right Column */}
        <div className="col-lg-8" style={styles.rightColumn}>
          {/* Video Section */}
          <h3 style={styles.subHeading}>Introduction</h3>
          <video width="100%" controls>
            <source src={teacher.videoIntro} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Work Experience */}
          <h3 style={styles.subHeading}>Work Experience</h3>
          <p>{teacher.workExperience}</p>
          <button className="btn btn-link">Read more</button>

          {/* Education */}
          <h3 style={styles.subHeading}>Education</h3>
          <ul>
            <li><strong>Master's Degree:</strong> {teacher.education.masters}</li>
            <li><strong>Bachelor's Degree:</strong> {teacher.education.bachelors}</li>
            <li><strong>Professor Details:</strong> {teacher.education.professorDetails}</li>
          </ul>

          {/* Subjects and Grades */}
        <h3 style={styles.subHeading}>Subjects Taught</h3>
          <ul>
            {teacher.subjects.map((subject, index) => (
              <li key={index}>
                {subject.subject} ({subject.grade}) - ${subject.rate}/hour
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
