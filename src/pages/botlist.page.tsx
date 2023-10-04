import {
  Container,
  Stack,
  ButtonBase,
  Typography,
  Link,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useGetChatbotsQuery } from "../redux/api/chatbotApi";
import { useNavigate } from "react-router-dom";

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 300,
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    height: 100,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
    "& .MuiTypography-root": {
      border: "4px solid currentColor",
    },
  },
}));
const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
});

const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create("opacity"),
}));

const BotlistPgae = () => {
  const chatbotInfo = useGetChatbotsQuery();

  const navigate = useNavigate();

  return (
    <>
      <Container sx={{ mt: 4, py: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          flexWrap="wrap"
          gap={5}
        >
          {chatbotInfo.data?.map((item, index) => (
            <Stack key={`chatbot_itme_${index}`} alignItems="center">
              <Card sx={{ width: 345 }}>
                <CardMedia
                  sx={{ height: 300 }}
                  image={`${process.env.REACT_APP_SERVER_ENDPOINT}/static/images/${item.image}`}
                  title="green iguana"
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    display="flex"
                    textAlign="center"
                    justifyContent="center"
                    alignItems="center"
                    height={50}
                  >
                    {item.scenario}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained" fullWidth>
                    Chat
                  </Button>
                </CardActions>
              </Card>
            </Stack>
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default BotlistPgae;
