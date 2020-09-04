/** @jsx createElement */
import { createElement, MouseEvent } from 'react';
import { GridList, GridListTileBar, GridListTile } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ResponseCard, CardButton } from '../interfaces/lexResponse';

type Props = {
  responseCard?: ResponseCard;
  onClick: (id?: string) => void;
};

export const ChatGrid = ({ responseCard, onClick }: Props) => {
  const classes = useStyles();

  const gridClickHandler = (buttons?: CardButton[]) => (event: MouseEvent<HTMLLIElement>) => {
    if (buttons && buttons.length > 0 && buttons[0].value) {
      onClick(buttons[0].value);
    }
    onClick();
  };

  const list = responseCard?.genericAttachments || [];
  return (
    <div className={classes.gridList}>
      <GridList cellHeight={230} spacing={2} cols={3}>
        {list.map((tile, i) => (
          <GridListTile key={i} onClick={gridClickHandler(tile.buttons)}>
            <img src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${tile.imageUrl}`} alt={tile.title} />
            <GridListTileBar
              titlePosition="bottom"
              title={tile.title}
              subtitle={tile.subTitle}
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
    margin: '15px 0'
  },
  title: {},
  titleBar: {}
}));
