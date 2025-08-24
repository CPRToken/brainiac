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
import { Seo } from "src/components/seo";
import { useSettings } from "src/hooks/use-settings";
import { tokens } from "../../../locales/tokens";
import { useTranslation } from "react-i18next";
import { saveDoc } from "../buttons/saveDoc";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { useProtectedPage } from "../../../hooks/use-protectedpage";
import useGPT4Submit from './gpt4-submit';
import ResponseText from "../clipboards/response-text";
import TextField from "@mui/material/TextField";


if (typeof window !== "undefined") {
  // ⛔ turn workers OFF completely
  (GlobalWorkerOptions as any).workerSrc = null;
}

export const DocReader: FC = () => {
  useProtectedPage();
  const { t } = useTranslation();
  const { handleSubmit, openAIResponse, isLoading } = useGPT4Submit();
  const { textRef, handleCopyText } = ResponseText();
  const settings = useSettings();
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

    // process uploaded files
    for (const file of files) {
      if (file.type === "application/pdf") {
        const buffer = await file.arrayBuffer();
        const pdf = await getDocument({
          data: new Uint8Array(buffer),
          // 👇 TS doesn't know about disableWorker, so we cast
          disableWorker: true,
        } as any).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          allText += content.items.map((s: any) => s.str).join(" ") + "\n";
        }
      } else if (
        file.type.includes("word") ||
        file.name.endsWith(".docx") ||
        file.name.endsWith(".doc")
      ) {
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

    const prompt = t(tokens.form.docReaderPrompts).replace("[docWords]", allText);
    const words = allText.split(" ").filter(Boolean);
    setTitle(words.slice(0, 5).join(" "));

    await handleSubmit(prompt, 4000);
  };


  return (
    <>

      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth={settings.stretch ? false : "xl"}>
          <Grid container spacing={{ xs: 3, lg: 4 }}>
            <Grid xs={12}>
              <Typography variant="body2" sx={{ paddingTop: 'value', paddingBottom: '30px' }}>
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
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </Button>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ mt: 2, mb:2,  flexWrap: "wrap" }}>
                {files.map((file, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      p: 0.5,              // less padding
                      minWidth: 100,        // narrower minimum
                      maxWidth: 190,       // optional cap
                      flex: "1 1 auto",    // allow flexible shrink/grow
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
              <TextField
                fullWidth
                label={t(tokens.form.pasteContract)}
                name="add"
                value={add}
                onChange={(e) => setAdd(e.target.value)}
                multiline
                rows={2}
              />

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
                        {index < array.length - 1 ? <br/> : null}
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
