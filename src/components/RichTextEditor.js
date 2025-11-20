// src/components/RichTextEditor.js

import 'react-quill/dist/quill.snow.css'; // Import the styles
import dynamic from 'next/dynamic';

// Import ReactQuill dynamically to prevent SSR errors
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function RichTextEditor({ value, onChange }) {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet'
    ];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <ReactQuill 
                theme="snow" 
                value={value} 
                onChange={onChange}
                modules={modules}
                formats={formats}
                style={{ flexGrow: 1 }} // Make the editor fill the available space
            />
        </div>
    );
}