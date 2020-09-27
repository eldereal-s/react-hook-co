import React, { useEffect, useRef, useState } from "react";
import { useRequestInfo } from "./Request";
import { Button, Card, CardActions, Collapse, IconButton, makeStyles, Paper, Snackbar, Tooltip, Typography } from '@material-ui/core';
import { useSnackbar, SnackbarContent } from "notistack";
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import orange from '@material-ui/core/colors/orange';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

export default function RequestVisualizer(){
    const reqs = useRequestInfo();
    return <>
        {reqs.map(req => <ReqNotify key={req.id} req={req} />)}
    </>
}

/**
 * 
 * @param {{
 *   req: import('./Request').RequestInfo
 * }} param0 
 */
function ReqNotify({ req }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const keyRef = useRef();
    useEffect(() => {
        if (req.state === 'waiting') {
            keyRef.current = enqueueSnackbar(`Request ${req.id}`, {
                persist: true,
                content: (key, message) => (
                    <SnackMessage id={key} message={message} time={req.duration} cancel={req.cancel} />
                )
            });
        } else {
            if (keyRef.current) {
                // setTimeout(() => closeSnackbar(keyRef.current), 1000);
            }
        }
    }, [req]);
    return null;
}


const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            minWidth: '344px !important',
        },
    },
    card: {
        backgroundColor: orange[300],
        backgroundImage: `linear-gradient(90deg, ${green[300]} 0%, ${green[300]} 95%, ${orange[300]} 100%);`,
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: -344,
        width: '100%',
    },
    typography: {
        fontWeight: 'bold',
    },
    actionRoot: {
        padding: '8px 8px 8px 16px',
        justifyContent: 'space-between'
    },
    icons: {
    },
    expand: {
        padding: '8px 8px',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    collapse: {
        padding: 16,
    },
    checkIcon: {
        fontSize: 20,
        color: '#b3b3b3',
        paddingRight: 4,
    },
    button: {
        padding: 0,
        textTransform: 'none',
    },
}));

const SnackMessage = React.forwardRef((props, ref) => {
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();

    const [cardStyle, setCardStyle] = useState();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleDismiss = () => {
        closeSnackbar(props.id);
    };
    
    const handleCancel = () => {
        setCardStyle({
            backgroundPositionX: 0,
            transition: `background-position-x linear ${time/1000}s 0s`,
            backgroundColor: red[300],
            backgroundImage: 'none',
        });
        props.cancel();
    };


    const time = props.time;

    
    /** @type {React.MutableRefObject<HTMLDivElement>} */
    const cardRef = useRef();

    useEffect(() => {
        if (!cardStyle) {
            const width = cardRef.current.clientWidth;
            const t = setTimeout(() => setCardStyle({
                backgroundPositionX: -width,
            }));
            return () => clearTimeout(t);
        } else if (!cardStyle.transition) {
            const t = setTimeout(() => {
                setCardStyle({
                    backgroundPositionX: 0,
                    transition: `background-position-x linear ${time/1000}s 0s`,
                });
            });
            return () => clearTimeout(t);
        } else if (!cardStyle.backgroundColor) {
            const t = setTimeout(() => {
                setCardStyle({
                    backgroundPositionX: 0,
                    transition: `background-position-x linear ${time/1000}s 0s`,
                    backgroundColor: green[300],
                    backgroundImage: 'none',
                })
            }, time);
            return () => clearTimeout(t);
        } else {
            setSuccess(true);
            const t = setTimeout(() => {
                handleDismiss();
            }, 1500);
            return () => clearTimeout(t);
        }
    }, [cardStyle])

    return (
        <SnackbarContent ref={ref} className={classes.root}>
            <Card ref={cardRef} className={classes.card} elevation={3} style={cardStyle}>
                <CardActions classes={{ root: classes.actionRoot }}>
                    <Typography variant="subtitle2" className={classes.typography}>{props.message}</Typography>
                    <div className={classes.icons}>
                        { success ? <IconButton className={classes.expand} onClick={handleDismiss}>
                            { error ? <ErrorOutlineIcon /> : <CheckCircleOutlineIcon />}
                        </IconButton>: <Tooltip title="Simluate network error on this request" ><IconButton className={classes.expand} onClick={handleCancel}>
                            <CloseIcon />
                        </IconButton></Tooltip>}
                        
                    </div>
                </CardActions>
            </Card>
        </SnackbarContent>
    );
});