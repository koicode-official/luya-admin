import { atom, atomFamily } from 'recoil'


export const paginationState = atomFamily({
  key: `paginationState`,
  default: (id) => ({
    id,
    pageNumber: 1,
    itemsPerPage: 20,
    totalCount: null,
  })
})

