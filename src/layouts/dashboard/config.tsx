import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@mui/material/SvgIcon';
import { useEffect, useMemo, useState } from 'react';

import HomeSmileIcon from 'src/icons/untitled-ui/duocolor/home-smile';
import Lock01Icon from 'src/icons/untitled-ui/duocolor/lock-01';

import File01Icon from 'src/icons/untitled-ui/duocolor/file-01';
import Upload04Icon from 'src/icons/untitled-ui/duocolor/upload-04';
import Users03Icon from 'src/icons/untitled-ui/duocolor/users-03';
import XSquareIcon from 'src/icons/untitled-ui/duocolor/x-square';
import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';
import { db, auth } from 'src/libs/firebase';
import { doc, getDoc } from 'firebase/firestore';
import {Pencil02} from "@untitled-ui/icons-react";
import {Face, Notes, AccountBox} from "@mui/icons-material";





export interface Item {
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  items?: Item[];
  label?: ReactNode;
  path?: string;
  title: string;
}

export interface Section {
  items: Item[];
  subheader?: string;
}




export const useSections = () => {
  const { t } = useTranslation();

  const { currentUser } = auth;

  const [userUrl, setUserUrl] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      getDoc(userDocRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              setUserUrl(userData.userUrl);
              setUserRole(userData.role);
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
    }
  }, [currentUser]);





  return useMemo(() => {
    return [
      {
        subheader: t(tokens.nav.dashboard),
        items: [
          {
            title: t(tokens.nav.overview),
            path: paths.dashboard.index,
            icon: <SvgIcon fontSize="small"><HomeSmileIcon /></SvgIcon>,
          },
          {
            title: t(tokens.nav.account),
            path: paths.dashboard.account,
            icon: <SvgIcon fontSize="small"><AccountBox /></SvgIcon>,
          },
          {
            title: t(tokens.nav.profile),
            path: `/dashboard/${userUrl}`,
            icon: <SvgIcon fontSize="small"><Face /></SvgIcon>,
          },
          {
            title: t(tokens.nav.contentManager),
            path: paths.dashboard.contentManager,
            icon: <SvgIcon fontSize="small"><Notes /></SvgIcon>,
          },
          {
            title: t(tokens.nav.contentWriter),
            path: paths.dashboard.contentWriter,
            icon: <SvgIcon fontSize="small"><Pencil02 /></SvgIcon>,
          },
          {
            title: t(tokens.nav.myContent),
            path: '', // empty or undefined since it's a parent menu item
            icon: <SvgIcon fontSize="small"><Upload04Icon /></SvgIcon>,
            items: [
              { title: t(tokens.headings.lyricWriter), path: paths.dashboard.lyricWriter },
              { title: t(tokens.headings.scriptWriter), path: paths.dashboard.scriptWriter },
              { title: t(tokens.headings.recipeWriter), path: paths.dashboard.recipeGen },
              { title: t(tokens.headings.dietPlanner), path: paths.dashboard.dietPlanner },
              { title: t(tokens.headings.poemGenerator), path: paths.dashboard.poemGenerator },
              { title: t(tokens.headings.seoArticleWriter), path: paths.dashboard.seoArticleWriter },
            ]
          }

        ],
      },

      ...(userRole.includes('admin')
          ? [
            {
              subheader: t(tokens.nav.pages),
              items: [
                {
                  title: t(tokens.nav.customers),
                  path: paths.dashboard.customers.index,
                  icon: <SvgIcon fontSize="small"><Users03Icon /></SvgIcon>,
                  items: [
                    { title: t(tokens.nav.list),
                      path: paths.dashboard.customers.index },
                  ],
                },

            {
              title: t(tokens.nav.auth),
              icon: (
                  <SvgIcon fontSize="small"><Lock01Icon /></SvgIcon>
              ),
              items: [
                {
                  title: t(tokens.nav.login),
                  items: [
                    { title: 'Classic',
                      path: paths.authDemo.login.classic },
                    { title: 'Modern',
                      path: paths.authDemo.login.modern },
                  ],
                },
                {
                  title: t(tokens.nav.register),
                  items: [
                    { title: 'Classic', path: paths.authDemo.register.classic },
                    { title: 'Modern', path: paths.authDemo.register.modern },
                  ],
                },


              {
                title: t(tokens.nav.forgotPassword),
                items: [
                  { title: 'Classic', path: paths.authDemo.forgotPassword.classic },
                  { title: 'Modern', path: paths.authDemo.forgotPassword.modern },
                ],
              },
              {
                title: t(tokens.nav.resetPassword),
                items: [
                  { title: 'Classic', path: paths.authDemo.resetPassword.classic },
                  { title: 'Modern', path: paths.authDemo.resetPassword.modern },
                ],
              },
              {
                title: t(tokens.nav.verifyCode),
                items: [
                  { title: 'Classic', path: paths.authDemo.verifyCode.classic },
                  { title: 'Modern', path: paths.authDemo.verifyCode.modern },
                ],
              },

          {
            title: t(tokens.nav.error),
            icon: <SvgIcon fontSize="small"><XSquareIcon /></SvgIcon>,
            items: [
              { title: '401', path: paths.notAuthorized },
              { title: '404', path: paths.notFound },
              { title: '500', path: paths.serverError },
            ],


            },

            ],
            },
                {
                  title: t(tokens.nav.components),
                  path: paths.components.index,
                  icon: <SvgIcon fontSize="small"><HomeSmileIcon /></SvgIcon>,
                },
            ],
            },
            ]
            : []),
    ];
    }
    , [t, userRole, userUrl]);
}



