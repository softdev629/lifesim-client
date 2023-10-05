import {
  Container,
  Stack,
  Typography,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Button,
} from "@mui/material";
import { useGetChatbotsQuery } from "../redux/api/chatbotApi";
import { useNavigate } from "react-router-dom";

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
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/chatbots/${item.slug}`)}
                  >
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
