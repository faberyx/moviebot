/** @jsx createElement */
import { createElement, MouseEvent, memo } from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Movie } from '../../interfaces/movie';
import PageviewIcon from '@material-ui/icons/Pageview';
import Chip from '@material-ui/core/Chip/Chip';
type Props = {
  movies: Movie[];
  search: string;
  onClick: (id?: string) => void;
};

const MovieGrid = ({ movies, search, onClick }: Props) => {
  const classes = useStyles();

  const gridClickHandler = (id: string) => (event: MouseEvent<HTMLLIElement>) => {
    console.log('gridClickHandler', id);
    onClick(id);
  };

  return (
    <div className={classes.gridList}>
      <div className={classes.searchtitle}>
        <PageviewIcon fontSize="large" /> &nbsp; Search result: &nbsp; <Chip variant="outlined" color="secondary" classes={{ label: classes.searchlabel }} label={search} />
      </div>
      <GridList cellHeight={300} spacing={8} cols={4}>
        {movies.map((tile, i) => (
          <GridListTile
            key={i}
            onClick={gridClickHandler(tile.id)}
            classes={{
              root: classes.titleBar,
              tile: classes.tile
            }}
          >
            <img onError={(event) => (event.target as any).setAttribute('src', '/noimage.jpg')} src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${tile.img}`} alt={tile.title} />
            <div>{tile.release}</div>
            <GridListTileBar
              titlePosition="bottom"
              title={tile.title}
              subtitle={tile.director}
              classes={{
                root: classes.titleBar,
                title: classes.title
              }}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  gridList: {
    margin: '15px 0',
    cursor: 'pointer'
  },
  searchtitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.2rem',
    width: '100%',
    color: theme.palette.primary.main,
    background: '#44444488',
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1, 2)
  },
  searchlabel: {
    fontSize: '1.0rem'
  },
  title: {},
  tile: {},
  titleBar: {}
}));

export const MovieGridComponent = memo(MovieGrid);
