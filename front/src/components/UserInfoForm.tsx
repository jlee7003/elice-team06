import { useState, useRef, MouseEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes";
import {
    Form,
    Input,
    OKButton,
    XButton,
    Label,
    SecondContainer,
    SecondContainer1,
    Select,
} from "../styles/pages/userInfo-style";
import { myInfo } from "@/api/user";
import errorRecoil from "@/recoil/errorRecoil";
import { Info } from "@/recoil/user";
import { useSetRecoilState } from "recoil";
import { changeMyInfo } from "../api/user";
interface Props {
    userInfo: {
        age: string;
        gender: string;
        introduce: string;
        nickname: string;
        profile_image: null;
        region: string;
    };
}

const UserInfoForm = (props: Props) => {
    const [userInfo, setUserInfo] = useState<Info | null>(null);
    const nickname = useRef<HTMLInputElement>(null);
    const introduce = useRef<HTMLInputElement>(null);
    const region = useRef<HTMLSelectElement>(null);
    const age = useRef<HTMLSelectElement>(null);
    const gender = useRef<HTMLInputElement>(null);
    const [ValidationCheck, setValidationCheck] = useState(false);
    const [inputStatus, setInputStatus] = useState("");
    const setError = useSetRecoilState(errorRecoil);
    const navigate = useNavigate();

    const handleClickRadioButton = (radioBtnName: string) => {
        setInputStatus(radioBtnName);
        console.log("radioBtnName:", radioBtnName, inputStatus);
    };
    function isvalidationtrue() {
        if (
            introduce.current == null ||
            nickname.current == null ||
            gender.current == null ||
            age.current == null ||
            region.current == null
        ) {
            return;
        }
        if (
            introduce.current?.value == "" ||
            nickname.current?.value == "" ||
            inputStatus == "" ||
            age.current?.value == "" ||
            region.current?.value == "" ||
            region.current?.value == "ν΄λΉμμ"
        ) {
            setValidationCheck(false);
            return;
        }
        setValidationCheck(true);
    }
    let formData = {
        updateData: {
            introduce: "",
            nickname: "",
            age: "",
            region: "",
            gender: "",
            profile_image: "",
        },
    };
    const validationTrue = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        isvalidationtrue();
    };
    const onClickPrevent = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    };
    const onClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (
            introduce.current == null ||
            nickname.current == null ||
            gender.current == null ||
            age.current == null ||
            region.current == null
        ) {
            return;
        }
        formData = {
            updateData: {
                age: age.current?.value,
                gender: inputStatus,
                introduce: introduce.current?.value,
                nickname: nickname.current?.value,
                region: region.current?.value,
                profile_image: "",
            },
        };
        const result: any = await changeMyInfo(formData);
        if (result?.response?.status != undefined) {
            setError({
                isError: true,
                message: result?.response?.data?.message,
            });
            return;
        }
        navigate(ROUTES.Home.path);
    };
    function selectnum() {
        var num = [];
        for (var i = 20; i <= 60; i += 10) {
            num.push(<option value={i + "λ"}>{i}λ</option>);
        }
        return num;
    }
    return (
        <SecondContainer>
            <SecondContainer1>
                <Form>
                    <Label>λλ€μ</Label>
                    <Input
                        className="input-readonly"
                        type="id"
                        placeholder="λλ€μμ μλ ₯νμΈμ."
                        name="nickname"
                        ref={nickname}
                        defaultValue={props.userInfo?.nickname}
                        readOnly
                    />

                    <Label>μΈμ¬λ§</Label>
                    <Input
                        placeholder="μΈμ¬λ§μ μλ ₯νμΈμ."
                        name="introduce"
                        defaultValue={props.userInfo?.introduce}
                        ref={introduce}
                    />
                    <Label>μ±λ³</Label>
                    <div>
                        <span>
                            <input
                                name="gender"
                                type="radio"
                                value="λ¨"
                                defaultChecked={props.userInfo?.gender === "λ¨"}
                                onClick={() => handleClickRadioButton("λ¨")}
                                ref={gender}
                            ></input>
                            <label style={{ marginRight: "40px" }}>λ¨</label>
                            <input
                                name="gender"
                                type="radio"
                                value="μ¬"
                                defaultChecked={props.userInfo?.gender === "μ¬"}
                                onClick={() => handleClickRadioButton("μ¬")}
                                ref={gender}
                            ></input>
                            μ¬
                        </span>
                    </div>
                    <Label>λμ΄</Label>
                    <Select defaultValue={props.userInfo?.age} ref={age} name="age">
                        {selectnum()}
                    </Select>
                    <Label>μ§μ­</Label>
                    <Select defaultValue={props.userInfo?.region} name="local" ref={region}>
                        <option value="ν΄λΉμμ">ν΄λΉμμ</option>
                        <option value="μμΈ">μμΈ</option>
                        <option value="κ²½κΈ°λ">κ²½κΈ°λ</option>
                        <option value="κ°μλ">κ°μλ</option>
                        <option value="μΆ©μ²­λ">μΆ©μ²­λ</option>
                        <option value="κ²½μλ">κ²½μλ</option>
                        <option value="μ λΌλ">μ λΌλ</option>
                    </Select>

                    {ValidationCheck ? (
                        <OKButton onClick={onClick} onMouseEnter={validationTrue}>
                            λ³κ²½νκΈ°
                        </OKButton>
                    ) : (
                        <XButton onClick={onClickPrevent} onMouseEnter={validationTrue}>
                            λ³κ²½νκΈ°
                        </XButton>
                    )}
                </Form>
            </SecondContainer1>
        </SecondContainer>
    );
};

export default UserInfoForm;
