---
layout: default
title: "Recommended VNC setup"
---

This page has instructions for setting up a recommended VNC setup on the cluster head node.

## Steps

Start by logging into the cluster head node via ssh:

```
ssh cscluster
```

Enter your username and password when prompted.

Next, kill your current VNC session (you won't need to do this if you don't have a VNC session running):

<pre>
vncserver -kill :<i>N</i>
</pre>

Replace *N* with your session number in the command above.

Next, run the following commands to save your old `.xsession` file and then create a new `.xsession` file with the recommended settings:

```
cd
[ ! -e .xsession ] || mv .xsession SAVE-xsession
cp /usr/local/data/example-xsession .xsession
```

Now, create a new VNC session:

<pre>
vncserver -geometry <i>W</i>x<i>H</i>
</pre>

Replace <i>W</i> and <i>H</i> with your preferred horizontal and vertical resolution.

## Using the VNC session

Right-clicking on the desktop brings up the Openbox menu.  A couple useful menu items are:

* **Terminal emulator** opens a terminal window
* **Debian** &rarr; **Applications** &rarr; **Editors** &rarr; **Gedit** starts the GNOME text editor

## Advanced

The recommended setup uses the Openbox window manager and the tint2 taskbar.  This is a lightweight but useful setup.

If you would like to customize your desktop, feel free to edit your `.xsession` file.  You will need to kill and restart your VNC session each time you make changes.

If there are particular window manager or taskbar programs you would like me to install, let me know.
