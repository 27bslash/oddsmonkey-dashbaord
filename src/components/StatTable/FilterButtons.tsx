import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { blue, green } from '@mui/material/colors';
import { SetStateAction, Dispatch } from 'react';
type FilterButtonProps = {
  filter: 'active' | 'day' | 'week' | 'all time';
  setFilter: Dispatch<SetStateAction<FilterButtonProps['filter']>>;
};
function FilterButtons({ filter, setFilter }: FilterButtonProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '20px',
      }}
    >
      <Typography
        variant="h5"
        textTransform={'capitalize'}
        marginBottom={'30px'}
      >
        filter by Bet Time
      </Typography>
      <ButtonGroup
        variant="contained"
        // disableElevation
        sx={{
          height: '45px',
          textWrap: 'nowrap',
          marginTop: '10px',
        }}
      >
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
      </ButtonGroup>
    </Box>
  );
}
function FilterButton({ currentFilter, setFilter, children }: any) {
  return (
    <Button
      sx={{
        backgroundColor: currentFilter === children ? blue['800'] : blue['600'],
      }}
      onClick={() => setFilter(children)}
    >
      <Typography>{children}</Typography>
    </Button>
  );
}
export default FilterButtons;
