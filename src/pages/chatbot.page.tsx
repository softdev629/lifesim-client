import { useState, useRef, useEffect } from "react";

import {
  Container,
  Box,
  Typography,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  FormGroup,
  Switch,
} from "@mui/material";
import { Mic, FiberManualRecord, Send } from "@mui/icons-material";
import { useParams } from "react-router-dom";

import { useChatMutation, useGetChatbotQuery } from "../redux/api/chatbotApi";
import FullScreenLoader from "../components/FullScreenLoader";

const ChatbotPage = () => {
  const { slug } = useParams();

  const { data, isLoading } = useGetChatbotQuery({ slug: slug as string });
  const [getResponse, chatState] = useChatMutation();

  const [count, setCount] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<{ type: string; text: string }[]>(
    []
  );
  const [msg, setMsg] = useState("");
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (chatState.isSuccess) {
      setMessages([
        ...messages,
        { type: "assistant", text: chatState.data.msg },
      ]);
      const audio = new Audio(chatState.data.url);
      audio.play();
    }
    if (chatState.isError) {
      console.log(chatState.error);
    }
  }, [chatState]);

  if (isLoading || !data) return <FullScreenLoader />;

  const handleSubmit = () => {
    getResponse({
      slug: slug as string,
      msg: [...messages, { type: "user", text: msg }],
    });
    setMessages([...messages, { type: "user", text: msg }]);
    setMsg("");
  };

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ p: 4, display: "flex", justifyContent: "space-between" }}
      >
        <Box width="35%">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box
              component="img"
              src={`${process.env.REACT_APP_SERVER_ENDPOINT}/static/images/${data.image}`}
            />
          </Box>
          <Typography textAlign="center" variant="h5" fontWeight={600} mt={2}>
            {data.scenario}
          </Typography>
          <Typography fontWeight={600} mt={2}>
            Start the conversation right away or provide more context below:
          </Typography>
          <Box display="flex" alignItems="center" gap={3} mt={2}>
            <Typography>Your Name: </Typography>
            <TextField size="small" />
          </Box>
          <Box display="flex" alignItems="center" gap={3} mt={2}>
            <Typography>How many people are you talking to: </Typography>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={count.toString()}
                onChange={(event) => {
                  setCount(parseInt(event.target?.value));
                }}
              >
                {data.person_details.map((_, index) => (
                  <FormControlLabel
                    key={`person_detail_item_index_${index}`}
                    value={`${index + 1}`}
                    control={<Radio />}
                    label={`${index + 1}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
          <Typography mt={2}>
            What is the conversation about? What is your goal for the
            conversation? What is your concern?
          </Typography>
          <TextField multiline rows={3} fullWidth />

          {Array.from({ length: count }).map((_, index) => (
            <Box key={`person_detail_item_${index}`} display="flex" mt={3}>
              <Typography width="50%">
                About the {["first", "second", "third"][index]} person:
              </Typography>
              <TextField
                multiline
                rows={3}
                fullWidth
                placeholder={data.person_details[index]}
              />
            </Box>
          ))}
        </Box>
        <Box
          width="55%"
          border="1px solid #D7D7D7"
          borderRadius={4}
          p={2}
          height={800}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Box borderRadius={4} flex={1} overflow="auto" p={2} ref={historyRef}>
            {messages.map((row, index) => (
              <Box
                display="flex"
                justifyContent={row.type === "user" ? "flex-end" : "flex-start"}
                mt={2}
                key={`message_item_${index}`}
              >
                <Box
                  bgcolor={row.type !== "user" ? "#F5F5F5" : "#17C3CE"}
                  color={row.type === "user" ? "white" : "black"}
                  p={2}
                  sx={{
                    borderTopLeftRadius: 30,
                    borderBottomLeftRadius: 30,
                    borderTopRightRadius: row.type === "user" ? 30 : 0,
                    borderBottomRightRadius: row.type === "user" ? 0 : 30,
                  }}
                  maxWidth={400}
                  height="auto"
                >
                  <Typography>{row.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box display="flex" component="form" onSubmit={handleSubmit} gap={4}>
            <TextField
              multiline
              rows={3}
              fullWidth
              value={msg}
              onChange={(event) => setMsg(event.target.value)}
              onKeyUp={(event) => {
                if (event.key === "Enter") handleSubmit();
              }}
            />
            <Box>
              <Box display="flex" justifyContent="space-evenly">
                <IconButton onClick={() => setIsRecording(!isRecording)}>
                  {!isRecording ? (
                    <Mic />
                  ) : (
                    <FiberManualRecord sx={{ fill: "red" }} />
                  )}
                </IconButton>
                <IconButton>
                  <Send />
                </IconButton>
              </Box>
              <FormGroup sx={{ mt: 2 }}>
                <FormControlLabel
                  sx={{ width: 120 }}
                  control={<Switch defaultChecked />}
                  label="Audio Response"
                />
              </FormGroup>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ChatbotPage;
