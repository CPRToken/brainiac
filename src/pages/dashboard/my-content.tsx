import React, { useEffect, useState } from 'react';
import { collection, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { Paper, Box, Button, Typography, Container, Stack, useTheme } from '@mui/material';


import dynamic from 'next/dynamic'
import { Seo } from 'src/components/seo';
import { useTranslation } from 'react-i18next';
import {secondaryFont, typography} from "src/theme/typography";
import {Layout as DashboardLayout} from "../../layouts/dashboard";

import { auth, db, storage } from 'src/libs/firebase';
import {tokens} from "../../locales/tokens";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const HtmlDocumentsPage = () => {
  const [documents, setDocuments] = useState<{id: string, content: string, title?: string}[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string>(""); // To hold HTML docs of the selected document for editing
  const [editedContent, setEditedContent] = useState('');

  const theme = useTheme();
  const { t } = useTranslation();

  const uid = auth.currentUser?.uid;




  useEffect(() => {
    const fetchHtmlDocuments = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const docsRef = collection(db, 'users', uid, 'documents');
        const querySnapshot = await getDocs(docsRef);
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          content: doc.data().htmlContent || '', // Assuming the HTML docs is stored here
          title: doc.data().title || 'Untitled', // Make sure this matches the field name in Firestore
        }));
        setDocuments(docs);
      }
    };

    fetchHtmlDocuments();
  }, []);

  const handleDocumentSelect = (docContent: string) => {
    setSelectedDoc(docContent);
    setEditedContent(docContent); // Set edited docs when selecting a document
  };
  const saveEdits = async () => {
    // Assuming you have a selected document ID and user UID available
    const docRef = doc(db, `users/${uid}/documents/${selectedDoc}`);
    try {
      await updateDoc(docRef, {
        htmlContent: editedContent, // Use editedContent for the update
      });
      console.log("Document successfully updated");
      setSelectedDoc(editedContent); // Optionally update selectedDoc to reflect the saved changes
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };



  return (
    <DashboardLayout>
      <Seo title="HTML Documents" />
      <Container sx={{ py: { xs: 5, md: 10, lg: 17 } }}>
        <Typography sx={{ ...typography.h5, mb: 9, mt: 1, textAlign: 'center' }}>
          {t(tokens.headings.myContent)}
        </Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)', // Creates 5 columns
          gap: 2, // Adjust the gap between items
        }}>
          {documents.map(doc => (
            <Paper
              key={doc.id}
              onClick={() => handleDocumentSelect(doc.content)} // Correct usage
              sx={{
                width: '100%', // Makes the item fill the column
                pt: '100%', // Padding-top equal to width for square aspect ratio
                position: 'relative',
                textAlign: 'center',
                '&:hover': {
                  boxShadow: 3, // Enhances the box shadow on hover
                },
              }}
            >
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Typography variant="subtitle1" sx={{ p: 1 }}>
                  {doc.title || "Untitled"}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
        {selectedDoc && (

          <ReactQuill
            theme="snow"
            value={editedContent}
            readOnly={false}
            onChange={setEditedContent}
            style={{
              width: '60%', // Set the width to 100% for full container width
              height: '400px', // Adjust the height to your preference
              lineHeight: '1.7', // Adjust the line height for spacing
              fontFamily: typography.fontTertiaryFamily, // Apply the font family from your theme
              fontSize: typography.body1.fontSize, // Apply the font size from your theme
            }}

          />

        )}
        <Button onClick={saveEdits}>Save </Button>

      </Container>
    </DashboardLayout>
  );
};

export default HtmlDocumentsPage;
