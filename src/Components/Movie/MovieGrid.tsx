/** @jsx createElement */
import { createElement, MouseEvent, memo } from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { MovieList } from '../../interfaces/movieList';

type Props = {
  movies: MovieList[];
  onClick: (id?: string) => void;
};

const MovieGrid = ({ movies, onClick }: Props) => {
  const classes = useStyles();

  const gridClickHandler = (id: string) => (event: MouseEvent<HTMLLIElement>) => {
    console.log('gridClickHandler', id);
    onClick(id);
  };

  return (
    <div className={classes.gridList}>
      <GridList cellHeight={300} spacing={8} cols={4}>
        {movies.map((tile, i) => (
          <GridListTile key={i} onClick={gridClickHandler(tile.id)}>
            <img onError={(event) => (event.target as any).setAttribute('src', '/noimage.jpg')} src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${tile.img}`} alt={tile.title} />
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
  title: {},
  titleBar: {}
}));

export const MovieGridComponent = memo(MovieGrid);
