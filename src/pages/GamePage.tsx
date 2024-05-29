import { Box, Button, Group, Image, Stack, Text } from "@mantine/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { SlArrowLeft } from "react-icons/sl";
import { IoIosAlert } from "react-icons/io";
import {
  getCurrentRound,
  getRandomDigitNumber,
  getToken,
} from "../utils/helpers";
import Countdown from "../component/Game/Countdown";
import { useState } from "react";
import { gamesStartDateTime } from "../config";
import { LuRefreshCcw } from "react-icons/lu";
import GameBody from "../component/Game/GameBody";
import Swal from "sweetalert2";
import axios from "../services/api";
import { setUser } from "../features/user/userSlice";

interface GamePageProps {
  imageSrc: string;
  left: string;
  right: string;
}

const GamePage = ({ imageSrc, left, right }: GamePageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: roomIdParam } = useParams();
  let roomId = parseInt(roomIdParam || "0");
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [roomNumberList, setRoomNumberList] = useState<number[]>(() => [
    getCurrentRound(1, gamesStartDateTime[0]),
    getCurrentRound(2, gamesStartDateTime[1]),
    getCurrentRound(3, gamesStartDateTime[2]),
  ]);
  const room5DigitNumber = getRandomDigitNumber(5).toString().split("");
  const availableRoomsId = [1, 2, 3];

  const onTimerEnd = () => {
    setRoomNumberList((rnl) => {
      let newList = [...rnl];
      newList[roomId - 1] = getCurrentRound(
        roomId,
        gamesStartDateTime[roomId - 1]
      );
      return newList;
    });
  };

  const onSubmit = async (side: boolean, amount: number) => {
    if (!user) {
      Swal.fire({
        icon: "error",
        text: "EN: user id is not found",
        confirmButtonColor: "#6EE3A5",
      });
      return;
    }
    if (amount < 1) {
      Swal.fire({
        icon: "error",
        text: "EN: bet amount must be greater than 0",
        confirmButtonColor: "#6EE3A5",
      });
      return;
    }
    if (amount > user.point) {
      Swal.fire({
        icon: "error",
        text: "EN: bet amount must not exceed user point",
        confirmButtonColor: "#6EE3A5",
      });
      return;
    }
    try {
      const token = getToken();
      await axios.post(
        `/game/bet`,
        {
          userId: user.id,
          side,
          label: side === false ? left : right,
          amount: amount,
          roomId: roomId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        text: "EN: create withdraw request success",
        confirmButtonColor: "#6EE3A5",
        timer: 2000,
      });

      const res = await axios.get(`/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { result } = res.data;

      localStorage.setItem("token", result.token);

      dispatch(
        setUser({
          id: result.id,
          phone: result.phone,
          point: result.point,
          role: result.role,
        })
      );
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "EN: failed to submit bet",
        confirmButtonColor: "#6EE3A5",
      });
      console.log(err);
    }
  };
  return (
    <>
      <Box bg="#87f3d9" pb={30}>
        <Group justify="space-between" p={10}>
          <Group gap={4}>
            <SlArrowLeft
              onClick={() => navigate("/app/home")}
              className="clickable"
              color="white"
              size="24px"
            />
            <Text c="white" style={{ fontSize: "18px", fontWeight: "bold" }}>
              ID: {user?.id}
            </Text>
          </Group>
          <Group gap={50}>
            <Stack gap={0} align="center">
              <Text c="white" fw="bold">
                Number: {roomNumberList[roomId - 1] + 3}
              </Text>
              <Countdown
                gameEndDateTime={
                  new Date(
                    new Date(gamesStartDateTime[roomId - 1]).getTime() +
                      (roomNumberList[roomId - 1] + 1) * 3 * 60 * 1000
                  )
                }
                onTimerEnd={onTimerEnd}
              />
            </Stack>
            <IoIosAlert
              onClick={() => navigate("/app/caution")}
              className="clickable"
              color="red"
              size="24px"
              style={{ backgroundColor: "white", borderRadius: "100%" }}
            />
          </Group>
        </Group>
        <Group justify="space-between" px="35px">
          <Group fw={700}>Number: {roomNumberList[roomId - 1]}</Group>
          <Group gap={10}>
            {room5DigitNumber.map((digit, index) => (
              <Group
                key={index}
                justify="center"
                w={35}
                h={35}
                fw={700}
                style={{ borderRadius: "100%", border: "2px solid white" }}
              >
                {digit}
              </Group>
            ))}
          </Group>
        </Group>
      </Box>
      <Group
        justify="space-around"
        w="100%"
        h={40}
        style={{ boxShadow: "0 2px 8px 0 #7c7c7c80" }}
      >
        {availableRoomsId.map((room, index) => (
          <Button
            key={index}
            onClick={() => navigate(location.pathname.slice(0, -1) + room)}
            style={{
              backgroundColor: roomId === room ? "#fa546f" : "#ecf5ff",
              color: roomId === room ? "white" : "black",
              border: roomId === room ? "none" : "1px solid #d6e8fe",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "700",
              width: "80px",
              height: "32px",
              boxSizing: "border-box",
              padding: "0",
              boxShadow: roomId === room ? "0 2px 4px 0 #00000080" : "",
            }}
          >
            PHÒNG {room}
          </Button>
        ))}
      </Group>
      <Group
        w="100%"
        justify="space-between"
        mt={15}
        p={10}
        style={{ borderLeft: "4px solid rgb(56, 123, 234)" }}
      >
        <Box></Box>
        <Text
          c="white"
          bg="rgb(148, 227, 206)"
          py={4}
          px={5}
          style={{ borderRadius: "5px" }}
        >
          UY TÍN TẠO NÊN THƯƠNG HIỆU
        </Text>
        <LuRefreshCcw
          onClick={() => window.location.reload()}
          size={22}
          className="clickable"
        />
      </Group>
      <GameBody
        left={left}
        right={right}
        roomNumber={roomNumberList[roomId - 1]}
        onSubmit={onSubmit}
      />
      <Image mt={32} src={imageSrc} />
    </>
  );
};

export default GamePage;