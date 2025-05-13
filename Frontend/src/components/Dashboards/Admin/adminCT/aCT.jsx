import React, { useState } from 'react';
import './aCT.css';
function aCT() {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        teacherName: '',
        teacherEmail: '',
        teacherPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleClick = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/teacher`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Data sent successfully!');
                setFormData({
                    teacherName: '',
                    teacherEmail: '',
                    teacherPassword: '',
                });
            } else {
                console.error('Failed to send data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="add-teacher-container">
            <h2 className="form-title">Add Teacher</h2>
            <div className="form-wrapper">
                <div className="input-group">
                    <label>
                        <i className="ri-user-line icon"></i>
                        <input
                            type="text"
                            name="teacherName"
                            placeholder="Name"
                            value={formData.teacherName}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div className="input-group">
                    <label>
                        <i className="ri-mail-unread-line icon"></i>
                        <input
                            type="email"
                            name="teacherEmail"
                            placeholder="Email"
                            value={formData.teacherEmail}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div className="input-group">
                    <label>
                        <i className="ri-lock-2-line icon"></i>
                        <input
                            type="password"
                            name="teacherPassword"
                            placeholder="Password"
                            value={formData.teacherPassword}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div className="button-container">
                    <button onClick={handleClick}>Add Teacher +</button>
                </div>
            </div>
        </div>
    );
}

export default aCT;
