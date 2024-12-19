import { useState, useRef, useEffect, MutableRefObject } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { object, string, any, array, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";

import { useGetVoicesQuery } from "../../redux/api/voiceApi";
import { useCreateChatbotMutation } from "../../redux/api/chatbotApi";

const newChatbotSaveSchema = object({
  scenario: string().min(1, "Scenario field is required."),
  image: any(),
  role_play_system_prompt: string().min(
    1,
    "System prompt for role-play is required."
  ),
  guide_system_prompt: string().min(1, "System prompt for guide is required."),
  person_details: array(string().min(1, "Person detail is required.")),
  person_voices: array(string().min(1, "Person voice is required.")),
  person_prefix: array(string().min(1, "Person prefix is required.")),
});

export type NewChatbotSaveSchema = TypeOf<typeof newChatbotSaveSchema>;

const CreateChatbotPage = () => {
  const [count, setCount] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [createChatbot, createState] = useCreateChatbotMutation();
  const methods = useForm<NewChatbotSaveSchema>({
    resolver: zodResolver(newChatbotSaveSchema),
  });

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (createState.isSuccess) {
      reset();
      toast.success("Chatbot created successfully!");
    }
    if (createState.isError) {
      if (Array.isArray((createState.error as any).data.detail)) {
        (createState.error as any).data.detail.map((el: any) =>
          toast.error(`${el.loc[1]} ${el.msg}`)
        );
      } else toast.error((createState.error as any).data.detail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createState]);

  const onSubmitHandler: SubmitHandler<NewChatbotSaveSchema> = (
    values: NewChatbotSaveSchema
  ) => {
    const formData = new FormData();
    formData.append("scenario", values.scenario);
    formData.append("image", values.image);
    formData.append("role_play_system_prompt", values.role_play_system_prompt);
    formData.append("guide_system_prompt", values.guide_system_prompt);
    formData.append("person_details", JSON.stringify(values.person_details));
    formData.append("person_voices", JSON.stringify(values.person_voices));
    formData.append("person_prefix", JSON.stringify(values.person_prefix));
    createChatbot(formData);
  };

  const getVoices = useGetVoicesQuery();

  return (
    <>
      <Container sx={{ pt: 8 }}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <FormProvider {...methods}>
            <Box display="flex" gap={4}>
              <TextField
                {...register("scenario")}
                label="Scenario"
                placeholder="Name of Scenario"
                sx={{ flexGrow: 1 }}
                error={!!errors["scenario"]}
                helperText={errors["scenario"]?.message}
              />
              <Button
                sx={{ flexGrow: 1 }}
                variant="contained"
                onClick={() => {
                  fileRef.current?.click();
                }}
              >
                Upload Image
              </Button>
              <Box
                ref={fileRef}
                component="input"
                type="file"
                sx={{ display: "none" }}
                onChange={(event) => {
                  if (event.target.files) {
                    setValue("image", event.target.files[0]);
                    const reader = new FileReader();
                    reader.onload = () => {
                      (
                        imgRef as MutableRefObject<HTMLImageElement>
                      ).current.src = reader.result as string;
                    };
                    reader.readAsDataURL(event.target.files[0]);
                  }
                }}
              />
            </Box>
            <img ref={imgRef} alt="" />
            <TextField
              {...register("role_play_system_prompt")}
              label="System Prompt for Role-Play"
              placeholder="Prompt for setting up the scenario. This prompt will be augmented with the additional information provided by the user."
              multiline
              rows={5}
              sx={{ mt: 4 }}
              fullWidth
              error={!!errors["role_play_system_prompt"]}
              helperText={errors["role_play_system_prompt"]?.message}
            />
            <TextField
              {...register("guide_system_prompt")}
              label="System Prompt for Guide"
              placeholder="Prompt for guiding the user in the conversation. This bot will also review the conversation at the end and provide an analysis of how the user did and what they could done better"
              multiline
              rows={5}
              sx={{ mt: 4 }}
              fullWidth
              error={!!errors["guide_system_prompt"]}
              helperText={errors["guide_system_prompt"]?.message}
            />
            <FormControl
              sx={{
                mt: 4,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
              fullWidth
            >
              <FormLabel id="count-row-radio-buttons-group-label">
                Up to how many people:{" "}
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="count-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={count}
                onChange={(event) => {
                  setCount(parseInt(event.target.value));
                }}
              >
                <FormControlLabel value="1" control={<Radio />} label="1" />
                <FormControlLabel value="2" control={<Radio />} label="2" />
                <FormControlLabel value="3" control={<Radio />} label="3" />
              </RadioGroup>
            </FormControl>
            {["1st", "2nd", "3rd"].slice(0, count).map((row, index) => (
              <Box
                key={`person_item_${index}`}
                display="flex"
                gap={5}
                sx={{ mt: 3 }}
              >
                <TextField
                  {...register(`person_details.${index}`)}
                  label={`Label of ${row} person details`}
                  fullWidth
                  error={
                    errors["person_details"] &&
                    !!errors[`person_details`][index]
                  }
                  helperText={
                    errors["person_details"] &&
                    errors[`person_details`][index]?.message
                  }
                />
                <FormControl fullWidth>
                  <InputLabel id="voice-label">Select Voice</InputLabel>
                  <Select
                    {...register(`person_voices.${index}`)}
                    labelId="voice-label"
                    id="voice-select"
                    label="Select voice"
                    defaultValue=""
                    onChange={(event) => {}}
                  >
                    {getVoices.data?.map((item: any, voice_index) => (
                      <MenuItem
                        key={`voice_${index}_item_${voice_index}`}
                        value={item["id"]}
                      >
                        {item["name"]} ({item["gender"]})
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText></FormHelperText>
                </FormControl>
                <TextField
                  {...register(`person_prefix.${index}`)}
                  label="Prefix"
                  fullWidth
                  error={
                    errors["person_prefix"] && !!errors[`person_prefix`][index]
                  }
                  helperText={
                    errors["person_prefix"] &&
                    errors[`person_prefix`][index]?.message
                  }
                />
              </Box>
            ))}
            <LoadingButton
              sx={{ mt: 4 }}
              fullWidth
              type="submit"
              variant="contained"
            >
              Create Chatbot
            </LoadingButton>
          </FormProvider>
        </Box>
      </Container>
    </>
  );
};

export default CreateChatbotPage;
