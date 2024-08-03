import { Button, Typography } from '@mui/material';
import { SetStateAction, Dispatch } from 'react';
type FilterButtonProps = {
  filter: 'active' | 'day' | 'week' | 'all time';
  setFilter: Dispatch<SetStateAction<FilterButtonProps['filter']>>;
};
function FilterButtons({ filter, setFilter }: any) {
  return (
    <>
      <FilterButton currentFilter={filter} setFilter={setFilter}>
        active
      </FilterButton>
      <FilterButton currentFilter={filter} setFilter={setFilter}>
        day
      </FilterButton>
      <FilterButton currentFilter={filter} setFilter={setFilter}>
        week
      </FilterButton>
      <FilterButton currentFilter={filter} setFilter={setFilter}>
        all time
      </FilterButton>
    </>
  );
}
function FilterButton({ currentFilter, setFilter, children }: any) {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: currentFilter === children ? 'blue' : 'transparent',
      }}
      onClick={() => setFilter(children)}
    >
      <Typography textTransform={'uppercase'}>{children}</Typography>
    </Button>
  );
}
export default FilterButtons;
