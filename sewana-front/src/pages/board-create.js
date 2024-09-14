import React, { useState } from 'react';
import '../assets/styles/board-create.css';
import cameraIcon from '../assets/images/camera-solid.svg'; // Update path according to your project structure

function BoardCreate() {
  const [formData, setFormData] = useState({
    isQuestion: true, // Checkbox for "질문글", initially checked
    title: '',
    content: '',
    file: null,
    fileName: '첨부파일',
  });

  const [imageSrc, setImageSrc] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        file: file,
        fileName: file.name,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = async () => {
    const { isQuestion, title, content, file } = formData;
    const formDataToSend = new FormData();
    formDataToSend.append('isQuestion', isQuestion);
    formDataToSend.append('title', title);
    formDataToSend.append('content', content);
    if (file) {
      formDataToSend.append('file', file);
    }

    try {
      const response = await fetch('/api/board-create', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('글이 성공적으로 작성되었습니다!');
        // Optionally redirect to another page or clear the form
      } else {
        alert('글 작성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <div className="board-create-container">
      <header>
        <button onClick={handleBack}>뒤로가기</button>
        <h1>글쓰기</h1>
        <div>
          <input type="button" id="submit" value="등록" onClick={handleSubmit} />
        </div>
      </header>

      <main>
        <form>
          <section className="form">
            {/* Checkbox for "질문글" with Checkbox on Right */}
            <article className="checkbox-section">
              <label htmlFor="question-checkbox" className="checkbox-label">
                <input
                  type="checkbox"
                  id="question-checkbox"
                  name="isQuestion"
                  checked={formData.isQuestion}
                  onChange={handleChange}
                />
                질문글
              </label>
            </article>

            {/* Title Input */}
            <article className="title">
              <input
                type="text"
                id="title"
                name="title"
                placeholder="제목을 입력하세요..."
                value={formData.title}
                onChange={handleChange}
                required
              />
            </article>

            {/* Content Textarea */}
            <article className="content">
              <textarea
                name="content"
                id="content"
                placeholder="내용을 입력하세요..."
                minLength="10"
                maxLength="200"
                value={formData.content}
                onChange={handleChange}
                required
              ></textarea>
            </article>
          </section>
          <section className="form-tail">
            <article className="filebox">
              <label htmlFor="file" className="filebox-label">
                <img src={cameraIcon} alt="카메라아이콘" />
              </label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <input
                className="upload-name"
                value={formData.fileName}
                placeholder="첨부파일"
                readOnly
              />
            </article>
          </section>
        </form>
        {imageSrc && (
          <section className="image-preview">
            <h2>미리보기:</h2>
            <img src={imageSrc} alt="Selected" />
          </section>
        )}
      </main>
    </div>
  );
}

export default BoardCreate;
