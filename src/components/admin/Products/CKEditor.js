import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const MyEditor = () => {
    const [editorData, setEditorData] = useState('');

    return (
        <div className="App">
            <h2>CKEditor 5 trong React</h2>
            <CKEditor
                editor={ ClassicEditor }
                data="<p>Nhập mô tả sản phẩm tại đây...</p>"
                onReady={ editor => {
                    console.log( 'Editor is ready to use!', editor );
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    setEditorData(data);
                    console.log( { event, editor, data } );
                } }
                onBlur={ ( event, editor ) => {
                    console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    console.log( 'Focus.', editor );
                } }
            />
            <div className="editor-output">
                <h3>Nội dung đã nhập:</h3>
                <div dangerouslySetInnerHTML={{ __html: editorData }} />
            </div>
        </div>
    );
}

export default MyEditor;
