/** @jsx createElement */
import { createElement, MouseEvent, memo, Fragment } from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Movie } from '../../interfaces/movie';
import PageviewIcon from '@material-ui/icons/Pageview';
import Chip from '@material-ui/core/Chip/Chip';
import { SearchMessage } from '../../interfaces/movieList';
import Tooltip from '@material-ui/core/Tooltip';
import withStyles from '@material-ui/core/styles/withStyles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

type Props = {
  movies: Movie[];
  search: SearchMessage;
  previousSearch: string[];
  onClick: (id?: string) => void;
};

const MovieGrid = ({ movies, search, previousSearch, onClick }: Props) => {
  const classes = useStyles();

  const gridClickHandler = (id: string) => (event: MouseEvent<HTMLLIElement>) => {
    console.log('gridClickHandler', id);
    onClick(id);
  };

  const getMessage = (search: SearchMessage) => {
    if (search.slots) {
      return (
        search.slots &&
        Object.entries(search.slots)
          .filter(([k, v]) => v)
          .map(([k, v]) => (
            <div key={k}>
              {k}: {v}
            </div>
          ))
      );
    }
    return 'No Match found';
  };

  return (
    <div className={classes.gridList}>
      <div className={classes.searchtitle}>
        <SearchTooltip title={getMessage(search)}>
          <PageviewIcon fontSize="large" />
        </SearchTooltip>
        &nbsp;
        <Fragment>
          {previousSearch.map((k, i) => (
            <Fragment key={`${i}_searchbox`}>
              {i > 0 && <NavigateNextIcon fontSize="small" color="primary" />}
              <SearchTooltip title={getMessage(search)}>
                <Chip variant="outlined" size="small" color="secondary" classes={{ label: classes.searchlabel }} label={k} />
              </SearchTooltip>
            </Fragment>
          ))}
        </Fragment>
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
              subtitle={tile.director.split('|').join(', ')}
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

const SearchTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.grey[100],
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    maxWidth: 500,
    fontSize: '0.9rem'
  }
}))(Tooltip);

const useStyles = makeStyles((theme) => ({
  gridList: {
    margin: '15px 0'
  },
  searchtitle: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    color: theme.palette.primary.main,
    background: '#0000007a',
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1, 2),
    borderRadius: '10px',
    overflow: 'hidden'
  },
  searchlabel: {
    fontSize: '0.9rem'
  },
  title: {},
  tile: {
    cursor: 'pointer'
  },
  titleBar: {}
}));

export const MovieGridComponent = memo(MovieGrid);
