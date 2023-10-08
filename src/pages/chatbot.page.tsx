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
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import {
  Mic,
  FiberManualRecord,
  Send,
  Settings,
  Close,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
// import { useAudioRecorder } from "react-audio-voice-recorder";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { useChatMutation, useGetChatbotQuery } from "../redux/api/chatbotApi";
import FullScreenLoader from "../components/FullScreenLoader";
// import { useGetTranscriptMutation } from "../redux/api/voiceApi";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

const ChatbotPage = () => {
  const { slug } = useParams();

  const { data, isLoading } = useGetChatbotQuery({ slug: slug as string });
  const [getResponse, chatState] = useChatMutation();

  const [count, setCount] = useState(1);
  const [messages, setMessages] = useState<{ type: string; text: string }[]>(
    []
  );

  const [msg, setMsg] = useState("");
  const historyRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const previousRef = useRef<string>("");
  const transcriptRef = useRef<string>("");
  const [isRecording, setIsRecoding] = useState(false);

  // const { startRecording, stopRecording, recordingBlob, isRecording } =
  //   useAudioRecorder();
  // const [getTranscript, tranState] = useGetTranscriptMutation();

  const {
    transcript,
    resetTranscript,
    isMicrophoneAvailable,
    browserSupportsSpeechRecognition,
    listening,
  } = useSpeechRecognition();

  console.log("preivous ---> ", previousRef.current);
  console.log("transcript ----> ", transcript);
  console.log("listening ----> ", listening);

  useEffect(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight });
  }, [messages]);

  console.log("microphone available ----> ", isMicrophoneAvailable);
  console.log("browser support ----> ", browserSupportsSpeechRecognition);

  // useEffect(() => {
  //   if (!recordingBlob) return;

  //   const audioFile = new File([recordingBlob], "audiofile.mp3", {
  //     type: "audio.mpeg",
  //   });

  //   const formdata = new FormData();
  //   formdata.append("audio", audioFile);
  //   getTranscript(formdata);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [recordingBlob]);

  // useEffect(() => {
  //   if (tranState.isSuccess) setMsg(tranState.data);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tranState]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatState]);

  useEffect(() => {
    setMsg(transcript);
    transcriptRef.current = transcript;
  }, [transcript]);

  const handleSubmit = () => {
    setMessages([...messages, { type: "user", text: msg }]);
    getResponse({
      slug: slug as string,
      msg: [...messages, { type: "user", text: msg }],
    });
    resetTranscript();
  };

  console.error("msg ----> ", msg);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTranscript = transcriptRef.current;
      const previousScript = previousRef.current;
      console.error(previousScript, currentTranscript);
      if (previousScript === currentTranscript && currentTranscript !== "") {
        console.log("HIHIHI");
        handleSubmit();
      } else {
        console.log("HOHOHO ----> ", currentTranscript);
        previousRef.current = currentTranscript;
      }
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !data) return <FullScreenLoader />;

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${process.env.REACT_APP_SERVER_ENDPOINT}/static/images/${data.image})`,
          // backgroundRepeat: "no-repeat",
          // backgroundSize: "cover",
          zIndex: -1,
          opacity: 0.2,
        }}
      />
      <Container
        sx={{
          p: 4,
          height: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          mt: 2,
        }}
      >
        <Box width="100%" maxWidth={600} textAlign="right" mb={2}>
          <IconButton onClick={() => setOpen(true)}>
            <Settings />
          </IconButton>
        </Box>
        <Box
          border="4px solid #272727"
          borderRadius={4}
          height={700}
          maxWidth={600}
          width="100%"
          display="flex"
          flexDirection="column"
          gap={3}
          // bgcolor="white"
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
          <Box
            display="flex"
            component="form"
            onSubmit={handleSubmit}
            gap={4}
            p={2}
            borderTop="2px dotted #272727"
          >
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
                <IconButton
                  onClick={async () => {
                    if (isRecording) {
                      SpeechRecognition.stopListening();
                    } else {
                      console.error("speech start!");
                      SpeechRecognition.startListening({ continuous: true });
                    }
                    setIsRecoding(!isRecording);
                  }}
                >
                  {!isRecording ? (
                    <Mic />
                  ) : (
                    <FiberManualRecord sx={{ fill: "red" }} />
                  )}
                </IconButton>
                <IconButton onClick={() => handleSubmit()}>
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box textAlign="right">
              <IconButton onClick={() => setOpen(false)}>
                <Close />
              </IconButton>
            </Box>
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
        </Fade>
      </Modal>
    </>
  );
};

export default ChatbotPage;
