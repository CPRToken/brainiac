import { subDays, subHours, subMinutes } from 'date-fns';

import type { Item } from 'src/types/file-manager';

const now = new Date();

export const items: Item[] = [
  {
    id: '719a07ce8e46dee2388d411c',
    author: {
      avatar: '/assets/avatars/avatar-alcides-antonio.png',
      name: 'Alcides Antonio',
    },
    createdAt: subMinutes(now, 15).getTime(),
    isFavorite: false,
    isPublic: false,
    items: [],
    itemsCount: 12,
    name: 'Documents',
    shared: [
      {
        avatar: '/assets/avatars/avatar-anika-visser.png',
        name: 'Anika Visser',
      },
      {
        avatar: '/assets/avatars/avatar-miron-vitold.png',
        name: 'Miron Vitold',
      },
    ],
    size: 528381242,
    tags: ['Business', 'Work', 'Homework', 'Cats', 'Holiday', 'Friends'],
    type: 'folder',
    updatedAt: null,
  },
  {
    id: 'ed41ba8be80fac27d08efe3a',
    author: {
      avatar: '/assets/avatars/avatar-fran-perez.png',
      name: 'Fran Perez',
    },
    createdAt: subMinutes(now, 23).getTime(),
    isFavorite: true,
    isPublic: true,
    items: [],
    itemsCount: 5,
    name: 'Videos',
    shared: [],
    size: 519090127,
    tags: ['Friends', 'Business', 'Homework', 'Personal'],
    type: 'folder',
    updatedAt: subMinutes(now, 2).getTime(),
  },
  {
    id: 'b8bb82b90aedf81d57ccdb4d',
    author: {
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: 'Anika Visser',
    },
    createdAt: subHours(subMinutes(now, 3), 4).getTime(),
    isFavorite: false,
    isPublic: false,
    items: [],
    itemsCount: 3,
    name: 'Photos',
    shared: [
      {
        avatar: '/assets/avatars/avatar-miron-vitold.png',
        name: 'Miron Vitold',
      },
      {
        avatar: '/assets/avatars/avatar-alcides-antonio.png',
        name: 'Alcides Antonio',
      },
      {
        avatar: '/assets/avatars/avatar-nasimiyu-danai.png',
        name: 'Nasimiyu Danai',
      },
    ],
    size: 194220900,
    tags: ['Homework', 'Holiday', 'Important', 'Work', 'Friends', 'Personal'],
    type: 'folder',
    updatedAt: null,
  },
  {
    id: 'b33fe3f9ced7e4fa7efcbd9a',
    author: {
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: 'Anika Visser',
    },
    createdAt: subHours(subMinutes(now, 16), 20).getTime(),
    isFavorite: true,
    isPublic: false,
    itemsCount: 17,
    name: 'invoices',
    shared: [],
    size: 731214568,
    tags: ['Personal', 'Important', 'Invoices'],
    type: 'folder',
    updatedAt: null,
  },
  {
    id: 'dffb38de19c7e9ce0dc690cf',
    author: {
      avatar: '/assets/avatars/avatar-carson-darrin.png',
      name: 'Carson Darrin',
    },
    createdAt: subHours(subMinutes(now, 23), 26).getTime(),
    isFavorite: true,
    isPublic: true,
    items: [],
    itemsCount: 12,
    name: 'assets',
    shared: [],
    size: 103885109,
    tags: ['Invoices', 'Personal', 'Holiday', 'Homework', 'Cats', 'Work'],
    type: 'folder',
    updatedAt: null,
  },
  {
    id: 'c23e85a978a79a5cb53c0b0a',
    author: {
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: 'Anika Visser',
    },
    createdAt: subDays(subHours(subMinutes(now, 41), 6), 2).getTime(),
    extension: 'pdf',
    isFavorite: true,
    isPublic: false,
    name: 'Personal-cv.pdf',
    shared: [
      {
        avatar: '/assets/avatars/avatar-alcides-antonio.png',
        name: 'Alcides Antonio',
      },
    ],
    size: 472262466,
    tags: ['Invoices', 'Work'],
    type: 'file',
    updatedAt: null,
  },

];
