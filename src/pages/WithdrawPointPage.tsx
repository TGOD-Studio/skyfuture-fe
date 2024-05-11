import FrameWithCenter from "../component/FrameWithCenter";
import { Button, Center, Input, Stack } from "@mantine/core";

const WithdrawPointPage = () => {
  return (
    <>
      <FrameWithCenter title="Draw points">
        <Stack style={{ height: "100vh", padding: "0px 20px 0px 20px"}}>
          <p style={{ margin: "0px"}}>Avalible points: user_point đ</p>
          <Input placeholder="Enter the number of points to withdraw" />
          <Center>
            <Button
              variant="gradient"
              style={{ paddingLeft: "25px", paddingRight: "25px" }}
              gradient={{
                from: "teal",
                to: "rgba(240, 240, 240, 1)",
                deg: 180,
              }}
            >
              Confirm
            </Button>
          </Center>
        </Stack>
      </FrameWithCenter>
    </>
  );
};

export default WithdrawPointPage;