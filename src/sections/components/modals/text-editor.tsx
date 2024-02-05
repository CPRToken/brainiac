import type { FC } from 'react';
import Attachment01Icon from '@untitled-ui/icons-react/build/esm/Attachment01';
import Expand01Icon from '@untitled-ui/icons-react/build/esm/Expand01';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { QuillEditor } from 'src/components/quill-editor';

interface TextEditorProps {
  content: string; // Add more props as needed
  onClose: () => void; // Assuming you implement a way to close the editor
}


export const TextEditor: FC<TextEditorProps> = ({ content, onClose }) => {

  return (
  <Box
    sx={{
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100'),
      p: 3,
    }}
  >
    <Paper
      elevation={12}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        margin: 3,
        maxWidth: '100%',
        minHeight: 700,
        mx: 'auto',
        outline: 'none',
        width: 700,
      }}
    >
      <Stack
        alignItems="center"
        direction="row"
        spacing={1}
        sx={{
          px: 2,
          py: 1,
        }}
      >
        <Typography
          sx={{ flexGrow: 1 }}
          variant="h6"
        >
          Text Editor
        </Typography>
        <IconButton>
          <SvgIcon>
            <Expand01Icon />
          </SvgIcon>
        </IconButton>
        <IconButton>
          <SvgIcon>
            <XIcon />
          </SvgIcon>
        </IconButton>
      </Stack>
      <Input
        disableUnderline
        fullWidth
        placeholder="To"
        sx={{
          p: 1,
          borderBottom: 1,
          borderBottomColor: 'divider',
          borderBottomStyle: 'solid',
        }}
      />
      <Input
        disableUnderline
        fullWidth
        placeholder="Subject"
        sx={{
          p: 1,
          borderBottom: 1,
          borderBottomColor: 'divider',
          borderBottomStyle: 'solid',
        }}
      />

      <QuillEditor

        placeholder="Your Content"
        defaultValue={content}

        sx={{
          border: 'none',
          flexGrow: 1,
        }}
      />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
        sx={{ p: 2 }}
      >

        <div>
          <Button variant="contained">Save Edit</Button>
        </div>
      </Stack>
    </Paper>
  </Box>
);
};
