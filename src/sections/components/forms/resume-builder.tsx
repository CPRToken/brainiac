import React from 'react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ResponseText from '../clipboards/response-text';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';

import PropTypes from "prop-types";
import {auth, db }  from "../../../libs/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import {useProtectedPage} from "../../../hooks/use-protectedpage";
import useGPT4Submit from "./gpt4-submit";





type Option = {
    label: string;
    value: string;
};



const languageOptions: Option[] = [
    { label: '', value: '' },
  { label: 'English', value: 'english' },
  { label: 'Spanish', value: 'spanish' },
  { label: 'French', value: 'french' },
  { label: 'German', value: 'german' },
  { label: 'Italian', value: 'italian' },
  { label: 'Portuguese', value: 'portuguese' },
  { label: 'Russian', value: 'russian' },
  { label: 'Chinese (Simplified)', value: 'chinese-simplified' },
  { label: 'Chinese (Traditional)', value: 'chinese-traditional' },
  { label: 'Japanese', value: 'japanese' },
  { label: 'Korean', value: 'korean' },
  { label: 'Arabic', value: 'arabic' },
  { label: 'Hindi', value: 'hindi' },
  { label: 'Turkish', value: 'turkish' },
  { label: 'Dutch', value: 'dutch' },
  { label: 'Swedish', value: 'swedish' },
  { label: 'Finnish', value: 'finnish' },
  { label: 'Danish', value: 'danish' },
  { label: 'Norwegian', value: 'norwegian' },
  { label: 'Polish', value: 'polish' },
  { label: 'Greek', value: 'greek' },
  { label: 'Hungarian', value: 'hungarian' },
  { label: 'Czech', value: 'czech' },
  { label: 'Slovak', value: 'slovak' },
  { label: 'Romanian', value: 'romanian' },
  { label: 'Bulgarian', value: 'bulgarian' },
  { label: 'Serbian', value: 'serbian' },
  { label: 'Croatian', value: 'croatian' },
  { label: 'Bosnian', value: 'bosnian' },
  { label: 'Slovenian', value: 'slovenian' },
  { label: 'Albanian', value: 'albanian' },
  { label: 'Lithuanian', value: 'lithuanian' },
  { label: 'Latvian', value: 'latvian' },
  { label: 'Estonian', value: 'estonian' },
  { label: 'Maltese', value: 'maltese' },
  { label: 'Thai', value: 'thai' },
  { label: 'Filipino', value: 'filipino' },
  { label: 'Vietnamese', value: 'vietnamese' },
  { label: 'Indonesian', value: 'indonesian' },
  { label: 'Malay', value: 'malay' },
  { label: 'Persian', value: 'persian' },
  { label: 'Hebrew', value: 'hebrew' },
  { label: 'Urdu', value: 'urdu' },
  { label: 'Swahili', value: 'swahili' },
  { label: 'Yoruba', value: 'yoruba' },
  { label: 'Igbo', value: 'igbo' },
  { label: 'Zulu', value: 'zulu' },
    // ... add more as needed
];


interface ResumeBuilderProps {
  uid?: string;
  email: string;
  contactNumber?: string;
  name?: string;
  maritalStatus?: string;
  highSchool?: string;
  highestYearCompleted?: string;
  university?: string;
  degree?: string;
  placesWorked?: string;

}


// ... rest of the code remains the same



export const ResumeBuilder: FC<ResumeBuilderProps> = (props) => {
  useProtectedPage();

  const {  name, email, contactNumber, maritalStatus, highSchool, highestYearCompleted, university, degree, placesWorked } = props;
  const [uid, setUid] = useState<string | null>(null);
  const { t } = useTranslation();
  const { handleSubmit, openAIResponse } = useGPT4Submit();
  const [language, setLanguage] = useState<string>('');
  const [profile, setIsPublic] = useState(false);
  const [age, setAge] = useState<string>(''); // New state for the title
  const [skills, setSkills] = useState<string>('');
  const [universitySchool, setUniversity] = useState<string>(props.university || '');
  const [degrees, setDegree] = useState<string>(props.degree || '');

  const [highSchoolEducation, setHighSchoolEducation] = useState<string>(props.highSchool || '');
  const [highestYear, setHighestYearCompleted] = useState<string>(props.highestYearCompleted || '');

  const [experience, setExperience] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

  const { textRef, handleCopyText } = ResponseText();



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);




    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const uid = auth.currentUser?.uid;
                if (!uid) return;
                const userDocRef = doc(db, 'users', uid);

                const docSnapshot = await getDoc(userDocRef);
                if (docSnapshot.exists()) {
                    setIsPublic(docSnapshot.data().isPublic || false);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };

        fetchProfile().catch(console.error); // Catch and log any errors from fetchProfile
    }, [uid]);



    const maxTokensForResume = 2000;

  const submitToOpenAI = () => {
    // Construct a prompt that OpenAI can use to generate a resume
    const newPrompt = `Please create a resume for the following candidate:
Name: ${name}
Age: ${age}
Email: ${email}
Contact Number: ${contactNumber}
Skills: ${skills}
Education: ${university}
Degrees: ${degree}
 Work Experience: ${placesWorked}
Language: ${language}`;

      setPrompt(newPrompt); // Update the prompt state
      handleSubmit(newPrompt, maxTokensForResume)
          .then(() => {
              // Handle successful submission if needed
          })
          .catch(error => {
              console.error("Error submitting to OpenAI:", error);
          });
  };

  useEffect(() => {
    if (language && university && age && experience && name && skills) {
      let newPrompt = `Please create a resume for the following candidate in {language} language :
Name: ${name}
Age: ${age}
Email: ${email}
Contact Number: ${contactNumber}
Skills: ${skills}
Education: ${university}
highSchool: ${highSchool}
highestYearCompleted: ${highestYearCompleted}
University: ${university}
Degrees: ${degrees}
degree: ${degree}
Work Experience: ${placesWorked}
`;

      // Update the prompt state with the new prompt
      setPrompt(newPrompt.trim());
    } else {
      setPrompt('');
    }
  }, [language, email, contactNumber, maritalStatus, highSchool, highestYearCompleted, university, degree, age, experience, skills]);




  return (
    <Box sx={{ p: 2, height: 'auto', minHeight: '500px', maxWidth: '800px', margin: 'auto' }}>
      <Stack spacing={3}>
        {/* New TextField for Name */}
        <TextField
          fullWidth
          label={t(tokens.form.name)}
           name="name"
          value={name}

        />
        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.email)}
            name="email"
            value={email}
            fullWidth
            sx={{
              width: 'calc(50% - 8px)', // Adjust the value 8px according to your spacing needs
            }}
            // Add your onChange handler if needed
          />
          <TextField
            label={t(tokens.form.contactNumber)}
            name="contactNumber"
            value={contactNumber} // You need to have a state or prop for this
            fullWidth
            sx={{
              width: 'calc(50% - 8px)', // Adjust the value 8px according to your spacing needs
            }}
            // Add your onChange handler if needed
          />
        </Stack>

        <TextField
          fullWidth
          label={t(tokens.form.age)}
          name="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.collegeTAFE)}
            name="highSchool"
            value={highSchoolEducation} // Use state here
            onChange={(e) => setHighSchoolEducation(e.target.value)} // Update state with user input
            sx={{
              width: 'calc(50% - 8px)',
            }}
            multiline
            rows={2}
          />
          <TextField
            label={t(tokens.form.course)}
            name="highestYearCompleted"
            value={highestYear} // Use state here
            onChange={(e) => setHighestYearCompleted(e.target.value)} // Update state with user input
            sx={{
              width: 'calc(50% - 8px)',
            }}
            multiline
            rows={2}
          />
        </Stack>


        <Stack direction="row" spacing={2}>
          <TextField
            label={t(tokens.form.universityList)}
            name="university"
            value={universitySchool} // Ensures the value is not undefined
            onChange={(e) => setUniversity(e.target.value)}
            sx={{
              width: 'calc(50% - 8px)',
            }}
            multiline
            rows={2}
          />
          <TextField
            label={t(tokens.form.degree)}
            name="degree"
            value={degrees} // Ensures the value is not undefined
            onChange={(e) => setDegree(e.target.value)}
            sx={{
              width: 'calc(50% - 8px)',
            }}
            multiline
            rows={2}
          />
        </Stack>

        {/* New TextField for Skills */}
        <TextField
          fullWidth
          label={t(tokens.form.skills)}
          name="skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          multiline // Enables multiline input
          rows={2} // Sets the number of rows
        />

        <TextField
          fullWidth
          label={t(tokens.form.workExperience)}
          name="experience"
          value={placesWorked}
          onChange={(e) => setExperience(e.target.value)}
          multiline // Enables multiline input
          rows={2} // Sets the number of rows
        />
        <TextField
          fullWidth
          label={t(tokens.form.resumeLanguage)} // Translates the label
          name="language"
          select
          SelectProps={{ native: true }}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>



        {/* Removed the TextField for Prompt as per your instructions */}
      </Stack>
      <Box sx={{ mt: 3 }}>
        {/* Button to submit the prompt to OpenAI */}
        <Button onClick={submitToOpenAI} type="submit" variant="contained" fullWidth>
          Submit
        </Button>
      </Box>
      {openAIResponse && (
        <Box sx={{ mt: 3 }}>
          <label>Your Resume:</label>
          <Button onClick={handleCopyText} title="Copy response text">
            <FileCopyIcon />
          </Button>
          <Paper elevation={3} ref={textRef} style={{ padding: '10px', overflow: 'auto', lineHeight: '1.5' }}>
            {openAIResponse.split('\n').map((str, index, array) => (
              <React.Fragment key={index}>
                {str}
                {index < array.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </Paper>
        </Box>
      )}
    </Box>
  );

};

ResumeBuilder.propTypes = {
  uid: PropTypes.string,
  maritalStatus: PropTypes.string,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  university: PropTypes.string,
  highSchool: PropTypes.string,
};
