'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { looksLikeHtml } from '@/lib/content/utils';
import { uploadImage } from './upload';

const COLORS = ['#111827', '#1a56db', '#0ea5e9', '#059669', '#d97706', '#dc2626', '#7c3aed', '#6b7280'];

function Btn({ on, label, title, onClick, disabled }: { on?: boolean; label: string; title: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" title={title} aria-label={title} disabled={disabled} className={on ? 'rte-b rte-b-on' : 'rte-b'} onMouseDown={(e) => e.preventDefault()} onClick={onClick}>
      <span className="mi">{label}</span>
    </button>
  );
}

function Toolbar({ ed }: { ed: Editor }) {
  const file = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState('');

  const setLink = () => {
    const prev = ed.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link address (leave empty to remove)', prev ?? 'https://');
    if (url === null) return;
    if (url.trim() === '' || url.trim() === 'https://') ed.chain().focus().extendMarkRange('link').unsetLink().run();
    else ed.chain().focus().extendMarkRange('link').setLink({ href: url.trim(), target: '_blank' }).run();
  };

  const addImage = async (f?: File) => {
    if (!f) return;
    setErr('');
    try {
      const src = await uploadImage(f);
      ed.chain().focus().setImage({ src, alt: '' }).run();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      if (file.current) file.current.value = '';
    }
  };

  const style = ed.isActive('heading', { level: 2 }) ? 'h2' : ed.isActive('heading', { level: 3 }) ? 'h3' : ed.isActive('heading', { level: 4 }) ? 'h4' : 'p';

  return (
    <div className="rte-bar">
      <select
        className="rte-sel"
        value={style}
        onChange={(e) => {
          const v = e.target.value;
          if (v === 'p') ed.chain().focus().setParagraph().run();
          else ed.chain().focus().toggleHeading({ level: Number(v[1]) as 2 | 3 | 4 }).run();
        }}
        aria-label="Text style"
      >
        <option value="p">Paragraph</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>
      <span className="rte-sep" />
      <Btn title="Bold" label="format_bold" on={ed.isActive('bold')} onClick={() => ed.chain().focus().toggleBold().run()} />
      <Btn title="Italic" label="format_italic" on={ed.isActive('italic')} onClick={() => ed.chain().focus().toggleItalic().run()} />
      <Btn title="Underline" label="format_underlined" on={ed.isActive('underline')} onClick={() => ed.chain().focus().toggleUnderline().run()} />
      <Btn title="Strikethrough" label="strikethrough_s" on={ed.isActive('strike')} onClick={() => ed.chain().focus().toggleStrike().run()} />
      <Btn title="Highlight" label="ink_highlighter" on={ed.isActive('highlight')} onClick={() => ed.chain().focus().toggleHighlight({ color: '#fef08a' }).run()} />
      <span className="rte-colors">
        {COLORS.map((c) => (
          <button type="button" key={c} title={`Text colour ${c}`} className="rte-color" style={{ background: c }} onMouseDown={(e) => e.preventDefault()} onClick={() => ed.chain().focus().setColor(c).run()} />
        ))}
      </span>
      <span className="rte-sep" />
      <Btn title="Bulleted list" label="format_list_bulleted" on={ed.isActive('bulletList')} onClick={() => ed.chain().focus().toggleBulletList().run()} />
      <Btn title="Numbered list" label="format_list_numbered" on={ed.isActive('orderedList')} onClick={() => ed.chain().focus().toggleOrderedList().run()} />
      <Btn title="Quote" label="format_quote" on={ed.isActive('blockquote')} onClick={() => ed.chain().focus().toggleBlockquote().run()} />
      <span className="rte-sep" />
      <Btn title="Align left" label="format_align_left" on={ed.isActive({ textAlign: 'left' })} onClick={() => ed.chain().focus().setTextAlign('left').run()} />
      <Btn title="Align centre" label="format_align_center" on={ed.isActive({ textAlign: 'center' })} onClick={() => ed.chain().focus().setTextAlign('center').run()} />
      <Btn title="Align right" label="format_align_right" on={ed.isActive({ textAlign: 'right' })} onClick={() => ed.chain().focus().setTextAlign('right').run()} />
      <span className="rte-sep" />
      <Btn title="Link" label="link" on={ed.isActive('link')} onClick={setLink} />
      <Btn title="Insert image" label="add_photo_alternate" onClick={() => file.current?.click()} />
      <Btn title="Divider" label="horizontal_rule" onClick={() => ed.chain().focus().setHorizontalRule().run()} />
      <span className="rte-sep" />
      <Btn title="Clear formatting" label="format_clear" onClick={() => ed.chain().focus().unsetAllMarks().clearNodes().run()} />
      <Btn title="Undo" label="undo" disabled={!ed.can().undo()} onClick={() => ed.chain().focus().undo().run()} />
      <Btn title="Redo" label="redo" disabled={!ed.can().redo()} onClick={() => ed.chain().focus().redo().run()} />
      <input ref={file} type="file" accept="image/*" hidden onChange={(e) => addImage(e.target.files?.[0])} />
      {err && <span className="rte-err">{err}</span>}
    </div>
  );
}

const plainToHtml = (s: string) => (s ? `<p>${s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '</p><p>')}</p>` : '');

/** WYSIWYG editor (TipTap) for descriptions; stores HTML. Plain-text defaults load as a paragraph. */
export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const [source, setSource] = useState(false);
  const [html, setHtml] = useState(value);

  const ed = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Image.configure({ HTMLAttributes: { loading: 'lazy' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write here…' }),
    ],
    content: looksLikeHtml(value) ? value : plainToHtml(value),
    onUpdate: ({ editor }) => {
      const out = editor.isEmpty ? '' : editor.getHTML();
      setHtml(out);
      onChange(out);
    },
  });

  useEffect(() => () => ed?.destroy(), [ed]);

  const toggleSource = () => {
    if (source && ed) ed.commands.setContent(looksLikeHtml(html) ? html : plainToHtml(html), false);
    setSource(!source);
  };

  if (!ed) return <div className="rte rte-loading">Loading editor…</div>;

  return (
    <div className="rte">
      {!source && <Toolbar ed={ed} />}
      {source ? (
        <textarea
          className="rte-src"
          value={html}
          spellCheck={false}
          onChange={(e) => {
            setHtml(e.target.value);
            onChange(e.target.value);
          }}
        />
      ) : (
        <EditorContent editor={ed} className="rte-body rt" />
      )}
      <button type="button" className="rte-srcbtn" onClick={toggleSource}>
        {source ? 'Back to visual editor' : '</> HTML source'}
      </button>
    </div>
  );
}
