import type { Editor } from 'tinymce';

type EditorConfig = {
    height: string;
    menubar: boolean;
    plugins: string[];
    toolbar: string;
    content_style: string;
    directionality: 'rtl' | 'ltr';
    language: string;
    base_url?: string;
    suffix?: string;
};

export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
    height: '60vh%',
    menubar: true,
    plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px }',
    directionality: 'rtl',
    language: 'ar'
};