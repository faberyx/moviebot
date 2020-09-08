/** @jsx createElement */
import { createElement, MouseEvent, memo } from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import makeStyles from '@material-ui/core/styles/makeStyles';

type Props = {
  response?: string;
  onClick: (id?: string) => void;
};

type MovieList = {
  id: string;
  title: string;
  tagline: string;
  img: string;
  director: string;
};

const ChatGrid = ({ response, onClick }: Props) => {
  const classes = useStyles();

  const getMovieList = () => {
    if (!response) {
      return [];
    }
    const responsePayload: MovieList[] = JSON.parse(response);

    return responsePayload;
  };

  const gridClickHandler = (id: string) => (event: MouseEvent<HTMLLIElement>) => {
    console.log('gridClickHandler', id);
    onClick(id);
  };

  return (
    <div className={classes.gridList}>
      <GridList cellHeight={300} spacing={2} cols={4}>
        {getMovieList().map((tile, i) => (
          <GridListTile key={i} onClick={gridClickHandler(tile.id)}>
            <img
              onError={(event) => (event.target as any).setAttribute('src', '/noimage.jpg')}
              src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${tile.img}`}
              alt={tile.title}
            />
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

export const ChatGridComponent = memo(ChatGrid);
