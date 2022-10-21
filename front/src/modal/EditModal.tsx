import { useRef, MouseEvent, useState, ChangeEvent } from "react";
import ModalPortal from "./ModalPortal";
import Draggable from "react-draggable";
import {
    ModalContainer,
    ModalBody,
    LongInput,
    FlexBox,
    GrayButton,
    GreenButton,
    Label,
    Input,
    NonFlexBox,
    AllCenterBox,
    TitleBOx,
    OKButton,
    XButton,
} from "@/styles/challengeRequestModal-style";
import * as _ from "lodash";
import { writeboard } from "@/api/board";
type Props = {
    modalOpen: number;
    closeModal: any;
    trigger: any;
    preData: any;
};
const DragContainer: any = Draggable;
const BoardEditModal: React.FC<Props> = ({ modalOpen, closeModal, trigger, preData }: Props) => {
    console.log("preData", preData);
    console.log(preData.title);
    let formData = {
        title: "",
        description: "",
    };

    //const title = useRef<HTMLInputElement>(null);
    //const description = useRef<HTMLInputElement>(null);
    const [ValidationCheck, setValidationCheck] = useState(false);
    const [inputText, setInputText] = useState(preData);

    console.log("inputText", inputText);

    const validationTrue = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        isvalidationtrue();
    };
    const onClickPrevent = (e: MouseEvent<HTMLButtonElement>) => {
        alert("빈 값이 있습니다.");
        e.preventDefault();
    };
    function isvalidationtrue() {
        if (inputText.title == null || inputText.description == null) {
            return;
        }
        if (inputText.title?.value == "" || inputText.description?.value == "") {
            setValidationCheck(false);
            return;
        }
        setValidationCheck(true);
    }
    const buttonClick = async () => {
        if (inputText.title == null || inputText.description == null) {
            return;
        }
        // formData = {
        //     title: title.current?.value,
        //     description: description.current?.value,
        // };
        if (inputText.title.value == "" || inputText.description.value == "") {
            alert("내용을 채워주세요");
            return;
        }
        const result = await writeboard(inputText);
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log("inputText.title", inputText.title);
        const { name, value } = e.target as any;
        setInputText({ ...inputText, [name]: value });
    };

    return (
        <>
            {preData && (
                <ModalPortal>
                    <ModalContainer style={{ visibility: modalOpen !== 0 ? "visible" : "hidden" }}>
                        <DragContainer>
                            <ModalBody>
                                <div>
                                    <TitleBOx>
                                        <h1>게시글 수정</h1>
                                        <button
                                            className="close"
                                            onClick={() => {
                                                closeModal();
                                            }}
                                        >
                                            ❌
                                        </button>
                                    </TitleBOx>
                                    <NonFlexBox style={{ marginTop: "60px" }}>
                                        <Label>
                                            <h2>제목</h2>
                                        </Label>
                                        <Input
                                            name="title"
                                            // ref={title}
                                            value={inputText.title}
                                            onChange={onChange}
                                        />
                                        <div style={{ display: "flex", width: "100%" }}></div>
                                        <FlexBox>
                                            <AllCenterBox></AllCenterBox>
                                        </FlexBox>
                                        <Label>
                                            <h2>내용</h2>
                                        </Label>
                                        <LongInput
                                            name="description"
                                            // ref={description}
                                            value={inputText.description}
                                            onChange={onChange}
                                        />
                                        <div style={{ marginBottom: "30px" }}>
                                            부적절한 제목이나 내용 작성 시, 운영자 또는 신고에 의해
                                            삭제될 수 있습니다
                                        </div>
                                    </NonFlexBox>

                                    <FlexBox style={{ justifyContent: "center" }}>
                                        <GrayButton
                                            className="close"
                                            onClick={() => {
                                                closeModal();
                                            }}
                                        >
                                            돌아가기
                                        </GrayButton>

                                        {ValidationCheck ? (
                                            <OKButton
                                                onClick={() => {
                                                    buttonClick;
                                                    closeModal();
                                                    trigger(modalOpen);
                                                }}
                                                onMouseEnter={validationTrue}
                                            >
                                                수정하기
                                            </OKButton>
                                        ) : (
                                            <XButton
                                                onClick={onClickPrevent}
                                                onMouseEnter={validationTrue}
                                            >
                                                수정하기
                                            </XButton>
                                        )}
                                    </FlexBox>
                                </div>
                            </ModalBody>
                        </DragContainer>
                    </ModalContainer>
                </ModalPortal>
            )}
        </>
    );
};

export default BoardEditModal;
