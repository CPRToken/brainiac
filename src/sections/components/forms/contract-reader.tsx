// src/sections/components/forms/contract-reader.tsx
import React, { FC, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Paper from "@mui/material/Paper";
import SvgIcon from "@mui/material/SvgIcon";
import Upload01Icon from "@untitled-ui/icons-react/build/esm/Upload01";
import TextField from "@mui/material/TextField";
import { Seo } from "src/components/seo";
import { useSettings } from "src/hooks/use-settings";
import { tokens } from "../../../locales/tokens";
import { useTranslation } from "react-i18next";
import { saveDoc } from "../buttons/saveDoc";
import { useProtectedPage } from "../../../hooks/use-protectedpage";
import useGPT4Submit from "./gpt4-submit";
import ResponseText from "../clipboards/response-text";

export const DocReader: FC = () => {
  useProtectedPage();
  const { t } = useTranslation();
  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const { textRef, handleCopyText } = ResponseText();
  const settings = useSettings();
  const [country, setCountry] = useState("");
  const [add, setAdd] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("Contract Summary");

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setFiles((prev) => [...prev, ...Array.from(newFiles)].slice(0, 5));
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const submitToOpenAI = async () => {
    if (files.length === 0 && !add.trim()) {
      console.error("No files or text provided.");
      return;
    }

    // start with pasted text (if any)
    let allText = add ? add + "\n" : "";

    // process uploaded Word files
    for (const file of files) {
      if (file.type.includes("word") || file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
        const { extractRawText } = await import("mammoth");
        const buffer = await file.arrayBuffer();
        const result = await extractRawText({ arrayBuffer: buffer });
        allText += result.value + "\n";
      }
    }

    if (!allText.trim()) {
      console.error("No text extracted.");
      return;
    }

    const prompt = t(tokens.form.docReaderPrompts)
      .replace("[docWords]", allText)
      .replace("[country]", country || ""); // fallback empty if not provided

    const words = allText.split(" ").filter(Boolean);
    setTitle(words.slice(0, 5).join(" "));

    await handleSubmit(prompt, 4000);
  };

  return (
    <>
      <Seo title="Dashboard: Contract Reader" />
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth={settings.stretch ? false : "xl"}>
          <Grid container spacing={{ xs: 3, lg: 4 }}>
            <Grid xs={12}>
              <Typography variant="body2" sx={{ mb: 3 }}>
                {t(tokens.form.contractReaderInstructions)}
              </Typography>

              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Button
                  component="label"
                  startIcon={
                    <SvgIcon>
                      <Upload01Icon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  {t(tokens.form.uploadDoc)}
                  <input
                    type="file"
                    hidden
                    multiple
                    accept=".doc,.docx"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </Button>
              </Stack>

              {/* Show uploaded files */}
              <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2, flexWrap: "wrap" }}>
                {files.map((file, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      p: 0.5,
                      minWidth: 100,
                      maxWidth: 190,
                      flex: "1 1 auto",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2">{file.name}</Typography>
                    <Button size="small" color="error" onClick={() => removeFile(file.name)}>
                      Remove
                    </Button>
                  </Box>
                ))}
              </Stack>

              {/* Text input option */}
              <TextField
                fullWidth
                label={t(tokens.form.pasteContract)}
                name="add"
                value={add}
                onChange={(e) => setAdd(e.target.value)}
                multiline
                rows={2}
              />
              <Box sx={{mt: 3}}>
                <TextField
                  label={t(tokens.form.country)}
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  fullWidth
                  multiline
                  rows={1}

                >
                </TextField>
              </Box>
              {/* Submit */}
              <Box sx={{ mt: 3 }}>
                <Button
                  onClick={submitToOpenAI}
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading || (files.length === 0 && !add.trim())}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </Box>

              {/* Response */}
              {openAIResponse && (
                <Box sx={{ mt: 3 }}>
                  <label>{t(tokens.form.contractAnalysis)}</label>
                  <Button onClick={handleCopyText} title="Copy response text">
                    <FileCopyIcon />
                  </Button>
                  <Paper
                    elevation={3}
                    ref={textRef}
                    style={{ padding: "30px", overflow: "auto", lineHeight: "1.5" }}
                  >
                    {openAIResponse.split("\n").map((str, index, array) => (
                      <React.Fragment key={index}>
                        {str}
                        {index < array.length - 1 ? <br /> : null}
                      </React.Fragment>
                    ))}
                  </Paper>
                  <div style={{ textAlign: "center", paddingTop: "20px" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => saveDoc(openAIResponse, title, t(tokens.form.contracts))}
                      style={{ marginTop: "20px", width: "200px" }}
                    >
                      {t(tokens.form.saveText)}
                    </Button>
                  </div>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
