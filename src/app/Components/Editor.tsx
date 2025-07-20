"use client";
import Quill, { Delta, Op, QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Hint } from "./hint";
import { Button } from "@/components/ui/button";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Smile, XIcon } from "lucide-react";
import { MdSend } from "react-icons/md";
import { cn } from "@/lib/utils";
import EmojiPopover from "./EmojiPopover";
import Image from "next/image";

type EditorValue = {
  image: File | null;
  body: string;
};
interface EditorProps {
  varient?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  placeholder?: string;
}
const Editor = ({
  varient = "create",
  onSubmit,
  onCancel,
  defaultValue = [],
  disabled = false,
  innerRef,
  placeholder = "Write something...",
}: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const placeholderRef = useRef(placeholder);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [image, setImage] = useState<File | null>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    defaultValueRef.current = defaultValue;
    placeholderRef.current = placeholder;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const option: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["link"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;
                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) {
                  return;
                }

                const body = JSON.stringify(quill.getContents());

                submitRef.current({ image: addedImage, body });
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, option);

    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toogleToolbar = () => {
    setIsToolbarVisible((prev) => !prev);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;

    quill?.insertText(quill.getSelection()?.index || 0, emoji.native);
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className=" flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(e) => {
          setImage(e.target.files?.[0] || null);
        }}
        className="hidden "
      />
      <div
        className={cn(
          " flex flex-col  border border-slate-200 rounded-md focus-within:border-slate-400 overflow-hidden focus-within:shadow-sm bg-white  transition ",
          disabled && "opacity-50"
        )}
      >
        <div ref={containerRef} className=" h-full ql-custom" />
        {!!image && (
          <div className="p-2">
            <div className=" flex items-center justify-center size-[62px] group/image relative">
              <Hint label="Remove image">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                  className="hidden group-hover/image:flex absolute -top-2.5  -right-2.5  items-center justify-center bg-black/70 hover:bg-black rounded-full text-white size-6 z-[5] border-2 "
                >
                  <XIcon className=" size-3.5" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                fill
                className="rounded-xl overflow-hidden object-cover border "
              />
            </div>
          </div>
        )}
        <div className="px-2 pb-2 flex z-[5]">
          <Hint label={isToolbarVisible ? "Hide toolbar" : "Show toolbar"}>
            <Button
              variant={"ghost"}
              size={"sm"}
              disabled={disabled}
              onClick={toogleToolbar}
              className="hover:text-accent-foreground hover:bg-accent/90"
            >
              <PiTextAa size={5} />
            </Button>
          </Hint>

          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button
              variant={"ghost"}
              size={"sm"}
              disabled={disabled}
              className="hover:text-accent-foreground hover:bg-accent/90"
            >
              <Smile size={5} />
            </Button>
          </EmojiPopover>
          {varient === "create" && (
            <Hint label="Image">
              <Button
                variant={"ghost"}
                size={"sm"}
                disabled={disabled}
                onClick={() => {
                  imageElementRef.current?.click();
                }}
                className="hover:text-accent-foreground hover:bg-accent/90"
              >
                <ImageIcon size={5} />
              </Button>
            </Hint>
          )}

          {varient === "update" && (
            <div className=" ml-auto gap-x-2 flex items-center bg-[#007a5a] hover:bg-[#007a5a]/90 text-white ] ">
              <Button variant={"outline"} disabled={false} onClick={onCancel}>
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                onClick={() => {
                  onSubmit({
                    image,
                    body: JSON.stringify(quillRef.current?.getContents()),
                  });
                }}
              >
                Save
              </Button>
            </div>
          )}

          {varient === "create" && (
            <Button
              disabled={disabled || isEmpty}
              size={"sm"}
              onClick={() => {
                onSubmit({
                  image,
                  body: JSON.stringify(quillRef.current?.getContents()),
                });
              }}
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white hover:bg-white text-accent-foreground cursor-not-allowed"
                  : " bg-[#007a5a] hover:bg-[#007a5a]/90  text-white"
              )}
            >
              <MdSend />
            </Button>
          )}
        </div>
      </div>
      {varient === "create" && (
        <div
          className={cn(
            "  text-sm p-2 flex justify-end  text-muted-foreground opacity-0 transition",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            {" "}
            <strong>Shift + Retrun </strong>&nbsp; to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
