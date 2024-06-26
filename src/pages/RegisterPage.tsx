import { Center, Container, Image, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "../services/api";
import { PhoneInput } from "react-international-phone";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegisterPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      phone: (value) =>
        value.length < 10 ? "Số điện thoại không hợp lệ" : null,
      password: (value) =>
        value.length < 5 ? "Mật khẩu phải dài hơn 5 ký tự" : null,
      confirmPassword: (value) =>
        value.length < 5 ? "Mật khẩu phải dài hơn 5 ký tự" : null,
    },
  });

  const createNewUser = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { password, confirmPassword } = form.getValues();
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        text: "Xác nhận mật khẩu không đúng",
        confirmButtonColor: "#6EE3A5",
      });
      return;
    }

    if (form.validate().hasErrors) {
      return;
    }

    try {
      await axios.post("/users", form.getValues());

      Swal.fire({
        icon: "success",
        text: "Đăng ký thành công",
        confirmButtonColor: "#6EE3A5",
        timer: 2000,
      });
      navigate("/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Đăng ký không thành công, vui lòng thử lại",
        confirmButtonColor: "#6EE3A5",
      });
      console.log(err);
    }
  };

  return (
    <Stack
      style={{
        minHeight: "100vh",
        boxShadow:
          "0 4px 2px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      }}
      bg="#77d5ae"
    >
      <Center bg="#88ffce" style={{ padding: "8px" }}>
        <b>SKYFUTURE</b>
      </Center>
      <Center>
        <Image src="./logo.png" alt="logo" height="254px" />
      </Center>
      <Container style={{ width: "100%", padding: "0px 30px 30px 30px" }}>
        <Container
          bg="linear-gradient(#86d3c3,#e8fcfb)"
          style={{
            width: "100%",
            borderRadius: "18px",
            border: "solid 2px black",
            paddingBottom: "12px",
          }}
        >
          <Stack style={{ padding: "20px" }}>
            <Center>
              <h2>Đăng ký</h2>
            </Center>
            <PhoneInput
              defaultCountry="vn"
              inputStyle={{ width: "100%" }}
              key={form.key("phone")}
              {...form.getInputProps("phone")}
            />
            <PasswordInput
              size="md"
              placeholder="Nhập mật Khẩu của bạn"
              key={form.key("password")}
              {...form.getInputProps("password")}
              style={{ width: "100%" }}
            />
            <PasswordInput
              size="md"
              placeholder="Nhập lại mật khẩu"
              key={form.key("confirmPassword")}
              {...form.getInputProps("confirmPassword")}
              style={{ width: "100%" }}
            />
            <p>
              Đã có tài khoản ? <Link to={"/"}>Đăng nhập ngay</Link>
            </p>
            <button
              onClick={(e) => createNewUser(e)}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                padding: "8px",
                width: "100%",
                border: "solid 2px black",
              }}
              className="clickable"
            >
              <b>Đăng ký</b>
            </button>
          </Stack>
        </Container>
      </Container>
    </Stack>
  );
};

export default RegisterPage;
