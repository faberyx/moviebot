/** @jsx createElement */
import { createElement, MouseEvent, memo, Fragment } from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Movie } from '../../Interfaces/movie';
import PageviewIcon from '@material-ui/icons/Pageview';
import Chip from '@material-ui/core/Chip/Chip';
import { SearchMessage } from '../../Interfaces/movieList';
import Tooltip from '@material-ui/core/Tooltip';
import withStyles from '@material-ui/core/styles/withStyles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

type Props = {
  movies: Movie[];
  search: SearchMessage;
  previousSearch: string[];
  onClick: (id?: number) => void;
};

const MovieGrid = ({ movies, search, previousSearch, onClick }: Props) => {
  const classes = useStyles();
  const theme = useTheme();

  const screenUpXL = useMediaQuery(theme.breakpoints.up('xl'));
  const screenUpMD = useMediaQuery(theme.breakpoints.up('md'));
  const screenDownMD = useMediaQuery(theme.breakpoints.down('md'));

  const gridClickHandler = (id: number) => (event: MouseEvent<HTMLLIElement>) => {
    onClick(id);
  };

  const getScreenWidth = () => {
    if (screenUpXL) {
      return 6;
    } else if (screenUpMD) {
      return 4;
    } else if (screenDownMD) {
      return 2;
    } else {
      return 2;
    }
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
      <GridList cellHeight={300} spacing={8} cols={getScreenWidth()}>
        {movies.map((tile, i) => (
          <GridListTile
            key={i}
            onClick={gridClickHandler(tile.id)}
            classes={{
              tile: classes.tile
            }}
          >
            <img onError={(event) => (event.target as any).setAttribute('src', '/noimage.jpg')} src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${tile.img}`} alt={tile.title} />
            <div>{tile.release}</div>
            <GridListTileBar classes={{ rootSubtitle: classes.titleBar }} titlePosition="bottom" title={tile.title} subtitle={tile.director.split('|').join(', ')} />
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
  titleBar: {
    background: 'rgba(0, 0, 0, 0.8)'
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

  tile: {
    cursor: 'pointer'
  }
}));

export const MovieGridComponent = memo(MovieGrid);
