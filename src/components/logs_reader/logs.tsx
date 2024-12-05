import hljs from 'highlight.js';
import { useEffect, useState } from 'react';
import 'highlight.js/styles/atom-one-dark.css'; // Use any available highlight.js theme

const Logs = () => {
  const [logStr, setLogStr] = useState('');
  const [highlightedContent, setHighlightedContent] = useState('');
  const escapeHTML = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
  useEffect(() => {
    const getData = async () => {
      const data = await window.electron.ipcRenderer.readLog();

      setLogStr(data);
    };
    getData();
  }, []);
  useEffect(() => {
    // Apply syntax highlighting after content is set
    const escapedContent = escapeHTML(logStr);

    //  const highlighted =         hljs.highlight(logStr, { language: 'python' }).value
    const highlighted = hljs.highlightAuto(logStr).value;

    setHighlightedContent(highlighted);
  }, [logStr]);
  return (
    <code
      style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
      dangerouslySetInnerHTML={{ __html: highlightedContent }}
    />
  );

  // <code style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}></code>
};
export default Logs;
