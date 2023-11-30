import React from "react";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";

interface Props {
  editor: Editor | null;
}

const CustomTextEditor = ({ editor }: Props) => {
  return (
    <RichTextEditor
      editor={editor}
      classNames={{
        root: "bg-card border-[0px] ",
        content: "bg-card text-card-foreground rounded-xl",
        control: "bg-card border-border text-foreground !hover:text-background",
      }}
    >
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default CustomTextEditor;
