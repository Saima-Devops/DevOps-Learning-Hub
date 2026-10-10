import { useEffect, useState } from "react";

const T = {
  bg:"#0B0F1A", surface:"#131929", card:"#1A2235",
  text:"#F0F4FF", textSub:"#B8C5D6", textMute:"#7A8FA6", textDim:"#4E6278",
  cyan:"#22D3EE", violet:"#A78BFA", amber:"#FBBF24",
  green:"#34D399", red:"#F87171", pink:"#F472B6",
};
const phaseRGB = { foundation:"34,211,238", intermediate:"167,139,250", advanced:"251,191,36" };
const POPPINS = "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');";
const GLOBAL_CSS = `
  * { box-sizing: border-box; }
`;

const GLOSSARY = {
  "Linux kernel":"The core of the operating system. It manages CPU scheduling, memory, devices, filesystems and networking, and exposes them to programs through system calls.",
  "shell":"A command interpreter that reads what you type and runs programs. Bash is the default interactive shell on most distributions; others include zsh, dash and fish.",
  "Bash":"The Bourne Again SHell. Adds variables, loops, functions, history and tab completion on top of the original sh. Most admin scripts are written for Bash.",
  "FHS":"Filesystem Hierarchy Standard. Defines where things live: /etc for configuration, /var for changing data and logs, /home for users, /usr for installed software, /tmp for temporary files.",
  "root user":"UID 0, the superuser. Bypasses normal permission checks. Admins should work as a normal user and elevate with sudo only when needed.",
  "sudo":"Runs a single command with another user's privileges (root by default). Rules live in /etc/sudoers and /etc/sudoers.d/ and must be edited with visudo.",
  "UID":"User ID. The number the kernel actually uses for ownership and permission checks. 0 is root, 1-999 are usually system accounts, 1000+ are regular users.",
  "GID":"Group ID. Every user has one primary group (stored in /etc/passwd) and can belong to many supplementary groups (stored in /etc/group).",
  "inode":"The on-disk record that stores a file's metadata: owner, permissions, timestamps, size and block locations. A filename is just a directory entry pointing to an inode.",
  "hard link":"A second directory entry pointing to the same inode. The data is only freed when the last link is removed. Cannot cross filesystems or point to directories.",
  "symbolic link":"A small file that contains a path to another file. Can cross filesystems and point to directories, but breaks if the target is moved or deleted. Created with ln -s.",
  "umask":"A mask that removes permission bits from newly created files and directories. A umask of 022 makes new files 644 and new directories 755.",
  "SUID":"Set-user-ID bit (4000). An executable with SUID runs with the file owner's privileges. /usr/bin/passwd uses it to write /etc/shadow.",
  "SGID":"Set-group-ID bit (2000). On a directory, new files inherit the directory's group, which is ideal for shared team folders. On an executable it runs with the file's group.",
  "sticky bit":"Permission bit (1000) on a directory meaning only a file's owner (or root) can delete or rename it. /tmp is 1777 for this reason.",
  "ACL":"Access Control List. Grants permissions to specific extra users or groups beyond owner/group/other. Managed with setfacl and getfacl; shown by a + after ls -l permissions.",
  "PID":"Process ID. A unique number for each running process. PID 1 is the init system (systemd), the ancestor of every other process.",
  "signal":"A software interrupt sent to a process. SIGTERM (15) asks it to exit cleanly, SIGKILL (9) kills it immediately, SIGHUP (1) often means reload configuration.",
  "daemon":"A background process that runs without a terminal, usually started at boot, such as sshd, crond or nginx. Names often end in d.",
  "nice value":"A scheduling hint from -20 (highest priority) to 19 (lowest). Regular users can only make processes nicer (higher numbers); root can raise priority.",
  "zombie process":"A process that has exited but whose parent has not yet collected its exit status. It uses no CPU or memory, only a process table slot. Fix the parent, not the zombie.",
  "OOM killer":"The kernel's Out-Of-Memory killer. When RAM and swap are exhausted it kills the process with the highest badness score. Logged in the kernel ring buffer (dmesg).",
  "stdin":"Standard input, file descriptor 0. Where a program reads input; the keyboard by default, or a file or pipe when redirected.",
  "stdout":"Standard output, file descriptor 1. Normal program output. Redirect it with > (overwrite) or >> (append).",
  "stderr":"Standard error, file descriptor 2. Error messages go here separately from normal output. Redirect with 2>, or merge into stdout with 2>&1.",
  "exit code":"The number a command returns when it finishes. 0 means success, anything else means failure. Stored in $? and used by && and || in scripts.",
  "regular expression":"A pattern language for matching text, used by grep, sed and awk. ^ anchors the line start, $ the end, . matches any character and * repeats.",
  "shebang":"The first line of a script, such as #!/bin/bash, telling the kernel which interpreter to run the file with.",
  "environment variable":"A named value inherited by child processes, such as HOME, PATH or LANG. Set with export NAME=value; made persistent in profile files.",
  "PATH":"The colon-separated list of directories the shell searches for commands. A command not in PATH must be run with its full or relative path.",
  "systemd":"The init system and service manager on modern distributions. Starts services in parallel, tracks them with cgroups, and manages logging, timers and mounts.",
  "unit file":"A systemd configuration file describing a service, timer, mount or other unit. Vendor units live in /usr/lib/systemd/system; your overrides go in /etc/systemd/system.",
  "journald":"The systemd logging service. Collects kernel, boot and service logs in a structured binary journal, read with journalctl.",
  "journalctl":"Queries the systemd journal. -u filters by unit, -b by boot, -p by priority, -f follows live and --since filters by time.",
  "cron":"The classic job scheduler. Each crontab line has five time fields (minute, hour, day of month, month, day of week) followed by the command.",
  "systemd timer":"A .timer unit that activates a matching .service on a schedule (OnCalendar) or after an interval. Gives logging and dependency handling that cron lacks.",
  "package manager":"Installs, upgrades and removes software along with its dependencies from repositories. APT on Debian/Ubuntu, DNF on RHEL/Fedora/Rocky/Alma.",
  "APT":"Advanced Package Tool for Debian and Ubuntu. apt update refreshes package lists; apt install, apt remove and apt upgrade manage packages. Low-level tool: dpkg.",
  "DNF":"The package manager for Fedora, RHEL, Rocky and AlmaLinux (successor to yum). Low-level tool: rpm.",
  "repository":"A server holding packages and signed metadata. Configured in /etc/apt/sources.list(.d) or /etc/yum.repos.d/.",
  "GPT":"GUID Partition Table. The modern partition scheme replacing MBR: supports disks over 2 TiB and up to 128 partitions. Managed with gdisk, parted or fdisk.",
  "ext4":"The default filesystem on Debian and Ubuntu. Mature and robust; can grow online and shrink offline. Checked with e2fsck, resized with resize2fs.",
  "XFS":"The default filesystem on RHEL-family systems. High performance for large files; can grow online with xfs_growfs but can never be shrunk.",
  "fstab":"/etc/fstab lists filesystems to mount at boot: device (preferably UUID=), mount point, type, options, dump and fsck order. A bad line can drop boot into emergency mode.",
  "UUID":"A unique identifier written into each filesystem. Device names like /dev/sdb can change between boots, so fstab should use UUID= (find it with blkid or lsblk -f).",
  "swap":"Disk space used as overflow when RAM is full. Created with mkswap, enabled with swapon, made permanent in fstab. Can be a partition or a file.",
  "tmpfs":"A filesystem that lives in RAM (and swap). Fast and wiped on reboot. Used for /run and often /tmp.",
  "LVM":"Logical Volume Manager. Pools disks (physical volumes) into volume groups and carves flexible logical volumes that can be resized and snapshotted.",
  "physical volume":"A disk or partition initialised for LVM with pvcreate. The building block of a volume group.",
  "volume group":"A pool of storage made of one or more physical volumes (vgcreate). Logical volumes are allocated from its free extents.",
  "logical volume":"A virtual block device carved from a volume group (lvcreate). Formatted and mounted like a partition, but resizable with lvextend -r.",
  "RAID":"Redundant Array of Independent Disks. Software RAID is managed with mdadm: RAID 1 mirrors, RAID 5 stripes with parity, RAID 10 mirrors and stripes.",
  "NFS":"Network File System. A server exports directories (/etc/exports) and clients mount them over the network, like a local filesystem.",
  "autofs":"Mounts filesystems on demand when a path is accessed and unmounts them after idle time. Configured through /etc/auto.master and map files.",
  "CIDR":"Classless notation for an IP plus its prefix length, such as 192.168.1.10/24. The /24 means the first 24 bits are the network part.",
  "default gateway":"The router that receives traffic for any destination not on a directly connected network. Shown as the default route in ip route.",
  "DNS":"Domain Name System. Translates names to IP addresses. Client resolvers are configured in /etc/resolv.conf, usually managed by systemd-resolved or NetworkManager.",
  "/etc/hosts":"A local static name-to-IP table checked before DNS (according to the order in /etc/nsswitch.conf). Handy for overrides and lab setups.",
  "NetworkManager":"The network configuration daemon on most RHEL and desktop systems. Managed with nmcli or nmtui; profiles are stored under /etc/NetworkManager.",
  "nmcli":"The command-line client for NetworkManager. Creates and modifies connection profiles: addresses, gateways, DNS, bonds, bridges and VLANs.",
  "Netplan":"Ubuntu's YAML network configuration layer in /etc/netplan/*.yaml. netplan apply renders it to systemd-networkd or NetworkManager.",
  "NTP":"Network Time Protocol. Keeps clocks synchronised with time servers. Accurate time matters for logs, TLS certificates and authentication.",
  "chrony":"A modern NTP implementation (chronyd). Configured in chrony.conf; chronyc sources and chronyc tracking show sync status.",
  "OpenSSH":"The standard SSH implementation. sshd is the server (configured in /etc/ssh/sshd_config) and ssh is the client (~/.ssh/config).",
  "SSH key":"A public/private key pair for passwordless, phishing-resistant login. ssh-keygen creates it and ssh-copy-id installs the public key in ~/.ssh/authorized_keys.",
  "sshd_config":"The SSH server configuration file. Common hardening: PermitRootLogin no, PasswordAuthentication no, AllowUsers. Test with sshd -t before reloading.",
  "nftables":"The modern Linux packet filtering framework replacing iptables. Rules are organised into tables, chains and sets and managed with the nft command.",
  "firewalld":"A zone-based firewall manager on RHEL-family systems, built on nftables. firewall-cmd with --permanent makes changes survive a reload.",
  "UFW":"Uncomplicated Firewall, Ubuntu's simple front end to the kernel firewall: ufw allow 22/tcp, ufw enable, ufw status.",
  "NAT":"Network Address Translation. Masquerading lets internal hosts share one public IP; DNAT (port forwarding) sends incoming traffic on one port to another host or port.",
  "port forwarding":"Redirecting traffic arriving on one port to another port or host, using DNAT rules in nftables or firewalld forward-port rules. Needs net.ipv4.ip_forward=1 to route between hosts.",
  "network bond":"Combines several network interfaces into one logical link for redundancy (active-backup) or throughput (802.3ad/LACP).",
  "network bridge":"A software switch joining interfaces at layer 2. Virtual machines and containers attach to bridges to share the host's network.",
  "reverse proxy":"A server that accepts client requests and forwards them to backend servers, often adding TLS termination, caching or load balancing.",
  "Nginx":"A high-performance web server and reverse proxy. proxy_pass forwards requests; an upstream block load-balances across backends.",
  "HAProxy":"A dedicated TCP/HTTP load balancer and proxy. Frontends accept connections; backends list the servers and the balancing algorithm.",
  "SELinux":"Security-Enhanced Linux, a mandatory access control system. Every process and file has a label, and policy decides what may access what, even for root.",
  "SELinux context":"The label on a file or process in the form user:role:type:level. Type enforcement uses the type part, such as httpd_t or httpd_sys_content_t. View with ls -Z or ps -Z.",
  "SELinux boolean":"An on/off switch that enables optional policy rules without writing policy, such as httpd_can_network_connect. Set permanently with setsebool -P.",
  "container":"An isolated process using kernel namespaces and cgroups, sharing the host kernel. Much lighter than a VM.",
  "Podman":"A daemonless, rootless-capable container engine with Docker-compatible commands. Can generate systemd units (Quadlet) so containers start at boot.",
  "Docker":"The best-known container engine. A dockerd daemon builds images and runs containers; the docker CLI controls it.",
  "KVM":"Kernel-based Virtual Machine. Turns the Linux kernel into a hypervisor using CPU virtualisation extensions (Intel VT-x, AMD-V).",
  "libvirt":"A management API and daemon for KVM and other hypervisors. Manages VMs, storage pools and virtual networks.",
  "virsh":"The libvirt command-line tool: virsh list --all, start, shutdown, destroy, autostart, dominfo and edit.",
  "sysctl":"Reads and sets kernel parameters under /proc/sys at runtime. Persist settings in /etc/sysctl.d/*.conf and load them with sysctl --system.",
  "ulimit":"Per-process resource limits such as open files (nofile) and processes (nproc). Set permanently in /etc/security/limits.conf or limits.d/ via PAM.",
  "load average":"The average number of runnable or uninterruptible processes over 1, 5 and 15 minutes. Compare it with the number of CPUs (nproc).",
  "iostat":"Reports CPU and per-device I/O statistics (from the sysstat package). High %util and await point to a disk bottleneck.",
  "GRUB":"GRand Unified Bootloader. Loads the kernel and initramfs. Edit kernel arguments at boot with e; configure defaults in /etc/default/grub.",
  "initramfs":"A small temporary root filesystem loaded with the kernel. It contains the drivers needed to find and mount the real root filesystem.",
  "Git":"A distributed version control system. Tracks changes in a repository with commits, branches and remotes.",
  "TLS":"Transport Layer Security. Encrypts network traffic and proves server identity with X.509 certificates. The successor to SSL.",
  "OpenSSL":"A toolkit for TLS and cryptography. Generates keys and CSRs, creates self-signed certificates, and inspects certificates and remote TLS servers.",
  "X.509 certificate":"A signed document binding a public key to a name (subject and SANs), with an issuer and validity dates. Inspect with openssl x509 -text -noout.",
  "LDAP":"Lightweight Directory Access Protocol. A central directory of users and groups so the same accounts work on many machines.",
  "SSSD":"System Security Services Daemon. Connects Linux to LDAP, FreeIPA or Active Directory for identity and authentication, with caching for offline logins.",
  "PAM":"Pluggable Authentication Modules. A stack of modules in /etc/pam.d/ that decides how users authenticate and which limits and session rules apply.",
};

const CHEATSHEET_TABS = [
  { id:"files", label:"Files & Text", cats:[
    {cat:"Navigate & Inspect",cmds:[
      {cmd:"ls -lah",desc:"Long listing with hidden files and human-readable sizes"},
      {cmd:"stat <file>",desc:"Inode, permissions, owner and all three timestamps"},
      {cmd:"file <file>",desc:"Identify a file's type from its content"},
      {cmd:"tree -L 2 /etc",desc:"Directory tree, two levels deep"},
      {cmd:"man -k <keyword>",desc:"Search man page descriptions (same as apropos)"},
      {cmd:"type <cmd>",desc:"Show whether a command is a builtin, alias or file"},
    ]},
    {cat:"Find Things",cmds:[
      {cmd:"find / -name '*.conf' -type f 2>/dev/null",desc:"Find files by name, hiding permission errors"},
      {cmd:"find /var -size +100M -mtime -7",desc:"Files over 100 MB changed in the last 7 days"},
      {cmd:"find /srv -user alice -exec chown bob {} +",desc:"Find by owner and act on every match"},
      {cmd:"find / -perm -4000 -type f",desc:"List all SUID executables"},
      {cmd:"grep -rn 'PermitRootLogin' /etc/ssh",desc:"Recursive search with line numbers"},
      {cmd:"locate sshd_config",desc:"Fast name lookup from the mlocate/plocate database"},
    ]},
    {cat:"Process Text",cmds:[
      {cmd:"grep -E '^(root|admin):' /etc/passwd",desc:"Extended regex match"},
      {cmd:"sed -i 's/old/new/g' file.txt",desc:"In-place search and replace on every line"},
      {cmd:"awk -F: '$3>=1000 {print $1}' /etc/passwd",desc:"Print regular usernames by UID"},
      {cmd:"cut -d: -f1,7 /etc/passwd",desc:"Extract fields 1 and 7"},
      {cmd:"sort -k3 -n file | uniq -c",desc:"Sort numerically on column 3 and count duplicates"},
      {cmd:"cmd 2>&1 | tee out.log",desc:"Show output and save stdout plus stderr to a file"},
    ]},
    {cat:"Archives & Links",cmds:[
      {cmd:"tar -czvf backup.tar.gz /etc",desc:"Create a gzip-compressed archive"},
      {cmd:"tar -xzvf backup.tar.gz -C /restore",desc:"Extract into a target directory"},
      {cmd:"tar -tf backup.tar.gz",desc:"List archive contents without extracting"},
      {cmd:"ln -s /opt/app/current /usr/local/bin/app",desc:"Create a symbolic link"},
      {cmd:"ln file.txt hardlink.txt",desc:"Create a hard link (same inode)"},
      {cmd:"rsync -avz src/ user@host:/dest/",desc:"Efficient copy that only sends changes"},
    ]},
  ]},
  { id:"users", label:"Users & Perms", cats:[
    {cat:"Users & Groups",cmds:[
      {cmd:"useradd -m -s /bin/bash -G wheel alice",desc:"Create user with home, shell and supplementary group"},
      {cmd:"passwd alice",desc:"Set or change a password"},
      {cmd:"usermod -aG docker alice",desc:"Append a supplementary group (never forget -a)"},
      {cmd:"chage -l alice",desc:"Show password ageing and expiry"},
      {cmd:"userdel -r alice",desc:"Delete a user and their home directory"},
      {cmd:"id alice",desc:"Show UID, GID and all groups"},
    ]},
    {cat:"Permissions",cmds:[
      {cmd:"chmod 750 script.sh",desc:"rwx owner, r-x group, nothing for others"},
      {cmd:"chmod g+s /srv/team",desc:"SGID: new files inherit the directory's group"},
      {cmd:"chmod +t /srv/shared",desc:"Sticky bit: only owners can delete their files"},
      {cmd:"chown -R alice:devs /srv/app",desc:"Change owner and group recursively"},
      {cmd:"umask 027",desc:"New files 640, new directories 750"},
      {cmd:"setfacl -m u:bob:rwx /srv/app",desc:"Grant an extra user access with an ACL"},
    ]},
    {cat:"sudo & Limits",cmds:[
      {cmd:"visudo -f /etc/sudoers.d/ops",desc:"Safely edit a sudo drop-in (syntax checked)"},
      {cmd:"sudo -l -U alice",desc:"List what alice may run with sudo"},
      {cmd:"getfacl /srv/app",desc:"Show all ACL entries and the mask"},
      {cmd:"setfacl -d -m g:devs:rwx /srv/app",desc:"Default ACL inherited by new files"},
      {cmd:"ulimit -a",desc:"Show the current shell's resource limits"},
      {cmd:"echo 'alice hard nproc 200' > /etc/security/limits.d/alice.conf",desc:"Persistent process limit for a user"},
    ]},
  ]},
  { id:"services", label:"Processes & Services", cats:[
    {cat:"Processes",cmds:[
      {cmd:"ps aux --sort=-%mem | head",desc:"Top memory consumers"},
      {cmd:"pgrep -a nginx",desc:"Find PIDs and command lines by name"},
      {cmd:"kill -15 <pid>",desc:"Ask a process to exit cleanly (SIGTERM)"},
      {cmd:"pkill -9 -u bob",desc:"Kill every process owned by bob"},
      {cmd:"renice -n 10 -p <pid>",desc:"Lower a running process's priority"},
      {cmd:"nohup ./job.sh &",desc:"Run in the background, surviving logout"},
    ]},
    {cat:"systemd",cmds:[
      {cmd:"systemctl enable --now nginx",desc:"Start now and at every boot"},
      {cmd:"systemctl status sshd",desc:"State, PID, recent log lines"},
      {cmd:"systemctl list-units --failed",desc:"Show every failed unit"},
      {cmd:"systemctl edit nginx",desc:"Create a drop-in override for a unit"},
      {cmd:"systemctl daemon-reload",desc:"Reload unit files after editing them"},
      {cmd:"systemctl mask bluetooth",desc:"Prevent a unit from being started at all"},
    ]},
    {cat:"Logs & Scheduling",cmds:[
      {cmd:"journalctl -u nginx -b -p err",desc:"Errors for a unit since this boot"},
      {cmd:"journalctl -f --since '10 min ago'",desc:"Follow recent journal entries"},
      {cmd:"crontab -e",desc:"Edit your user crontab"},
      {cmd:"systemctl list-timers --all",desc:"Show systemd timers and next run"},
      {cmd:"echo 'tar czf /tmp/b.tgz /etc' | at 02:00",desc:"Run a one-off job at a set time"},
      {cmd:"dnf install httpd  |  apt install apache2",desc:"Install a package (RHEL | Debian family)"},
    ]},
  ]},
  { id:"storage", label:"Storage & LVM", cats:[
    {cat:"Disks & Filesystems",cmds:[
      {cmd:"lsblk -f",desc:"Block devices with filesystem type, UUID and mount point"},
      {cmd:"parted /dev/sdb mklabel gpt mkpart data 1MiB 100%",desc:"New GPT label and one full-size partition"},
      {cmd:"mkfs.xfs /dev/sdb1",desc:"Create an XFS filesystem"},
      {cmd:"blkid /dev/sdb1",desc:"Show the UUID for fstab"},
      {cmd:"mount -a",desc:"Mount everything in fstab (test after editing it)"},
      {cmd:"findmnt --verify",desc:"Check fstab for errors before rebooting"},
    ]},
    {cat:"LVM",cmds:[
      {cmd:"pvcreate /dev/sdc /dev/sdd",desc:"Initialise disks as physical volumes"},
      {cmd:"vgcreate data_vg /dev/sdc /dev/sdd",desc:"Pool them into a volume group"},
      {cmd:"lvcreate -n app_lv -L 10G data_vg",desc:"Create a 10 GiB logical volume"},
      {cmd:"lvextend -r -L +5G /dev/data_vg/app_lv",desc:"Grow the LV and its filesystem together"},
      {cmd:"vgextend data_vg /dev/sde",desc:"Add a new disk to the pool"},
      {cmd:"pvs; vgs; lvs",desc:"Summaries of PVs, VGs and LVs"},
    ]},
    {cat:"Swap, NFS & Space",cmds:[
      {cmd:"mkswap /dev/sdb2 && swapon /dev/sdb2",desc:"Create and enable swap"},
      {cmd:"swapon --show",desc:"List active swap areas"},
      {cmd:"mount -t nfs srv:/export /mnt/nfs",desc:"Mount an NFS share"},
      {cmd:"exportfs -rav",desc:"Re-export everything in /etc/exports"},
      {cmd:"df -hT; df -i",desc:"Space and inode usage per filesystem"},
      {cmd:"du -xh --max-depth=1 /var | sort -h",desc:"Find what is filling a filesystem"},
    ]},
  ]},
  { id:"network", label:"Networking", cats:[
    {cat:"Inspect",cmds:[
      {cmd:"ip -br addr",desc:"Brief list of interfaces and addresses"},
      {cmd:"ip route",desc:"Routing table and default gateway"},
      {cmd:"ss -tulpn",desc:"Listening TCP/UDP sockets with owning process"},
      {cmd:"resolvectl status",desc:"DNS servers per interface (systemd-resolved)"},
      {cmd:"dig +short example.com",desc:"Query DNS directly"},
      {cmd:"tracepath 8.8.8.8",desc:"Show the path to a host"},
    ]},
    {cat:"Configure",cmds:[
      {cmd:"nmcli con mod eth0 ipv4.addresses 10.0.0.5/24 ipv4.gateway 10.0.0.1 ipv4.method manual",desc:"Persistent static IPv4 with NetworkManager"},
      {cmd:"nmcli con up eth0",desc:"Apply a modified connection"},
      {cmd:"hostnamectl set-hostname web01",desc:"Set the hostname persistently"},
      {cmd:"ip route add 10.20.0.0/16 via 10.0.0.254",desc:"Add a runtime static route"},
      {cmd:"netplan try",desc:"Apply Netplan config with automatic rollback (Ubuntu)"},
      {cmd:"timedatectl set-ntp true",desc:"Enable time synchronisation"},
    ]},
    {cat:"Firewall & SSH",cmds:[
      {cmd:"firewall-cmd --permanent --add-service=http && firewall-cmd --reload",desc:"Open HTTP permanently (firewalld)"},
      {cmd:"firewall-cmd --permanent --add-forward-port=port=8080:proto=tcp:toport=80",desc:"Redirect port 8080 to 80"},
      {cmd:"ufw allow 22/tcp && ufw enable",desc:"Allow SSH and enable UFW"},
      {cmd:"nft list ruleset",desc:"Show the full nftables configuration"},
      {cmd:"ssh-keygen -t ed25519 && ssh-copy-id user@host",desc:"Create a key and install it on a server"},
      {cmd:"sshd -t && systemctl reload sshd",desc:"Validate sshd_config, then reload safely"},
    ]},
  ]},
  { id:"security", label:"Security & Ops", cats:[
    {cat:"SELinux",cmds:[
      {cmd:"getenforce; sestatus",desc:"Current mode and policy details"},
      {cmd:"ls -Z /var/www/html",desc:"Show file SELinux contexts"},
      {cmd:"semanage fcontext -a -t httpd_sys_content_t '/srv/web(/.*)?'",desc:"Persistent context rule for a path"},
      {cmd:"restorecon -Rv /srv/web",desc:"Apply the policy's contexts to files"},
      {cmd:"setsebool -P httpd_can_network_connect on",desc:"Persistently enable a boolean"},
      {cmd:"ausearch -m AVC -ts recent",desc:"Find recent SELinux denials"},
    ]},
    {cat:"Containers & VMs",cmds:[
      {cmd:"podman run -d --name web -p 8080:80 nginx",desc:"Run a detached container with a port mapping"},
      {cmd:"podman ps -a; podman logs web",desc:"List containers and read their logs"},
      {cmd:"podman exec -it web sh",desc:"Shell inside a running container"},
      {cmd:"virsh list --all",desc:"All VMs, running or not"},
      {cmd:"virsh autostart vm1",desc:"Start a VM automatically at boot"},
      {cmd:"virsh shutdown vm1  |  virsh destroy vm1",desc:"Graceful stop | forced power off"},
    ]},
    {cat:"Kernel, Git & TLS",cmds:[
      {cmd:"sysctl -w net.ipv4.ip_forward=1",desc:"Change a kernel parameter at runtime"},
      {cmd:"echo 'net.ipv4.ip_forward=1' > /etc/sysctl.d/90-fwd.conf && sysctl --system",desc:"Make it persistent"},
      {cmd:"git clone <url>; git add -A; git commit -m 'msg'",desc:"Core Git workflow"},
      {cmd:"git log --oneline -5; git diff",desc:"Recent history and unstaged changes"},
      {cmd:"openssl req -x509 -newkey rsa:2048 -nodes -keyout k.pem -out c.pem -days 365 -subj '/CN=web01'",desc:"Self-signed certificate and key"},
      {cmd:"openssl x509 -in c.pem -noout -dates -subject",desc:"Check a certificate's subject and expiry"},
    ]},
  ]},
  { id:"trouble", label:"Troubleshooting", cats:[
    {cat:"Performance",cmds:[
      {cmd:"uptime; nproc",desc:"Load averages versus CPU count"},
      {cmd:"top -o %CPU",desc:"Live process view sorted by CPU"},
      {cmd:"free -h",desc:"Memory and swap usage (look at available)"},
      {cmd:"vmstat 2 5",desc:"CPU, memory, swap and I/O every 2 seconds"},
      {cmd:"iostat -xz 2",desc:"Per-disk utilisation and latency"},
      {cmd:"lsof +L1",desc:"Deleted files still held open (space not freed)"},
    ]},
    {cat:"Boot & Recovery",cmds:[
      {cmd:"systemctl get-default",desc:"Default boot target (multi-user or graphical)"},
      {cmd:"systemctl set-default multi-user.target",desc:"Boot to text mode by default"},
      {cmd:"journalctl -b -1 -p err",desc:"Errors from the previous boot"},
      {cmd:"dmesg -T | tail -30",desc:"Recent kernel messages with timestamps"},
      {cmd:"fsck -f /dev/sdb1",desc:"Force a check on an unmounted ext filesystem"},
      {cmd:"xfs_repair /dev/sdb1",desc:"Repair an unmounted XFS filesystem"},
    ]},
    {cat:"Connectivity",cmds:[
      {cmd:"ping -c3 <gateway>",desc:"Is the local network path up?"},
      {cmd:"getent hosts example.com",desc:"Resolve using the system's full NSS order"},
      {cmd:"curl -vI https://host",desc:"HTTP headers and TLS handshake details"},
      {cmd:"nc -zv host 443",desc:"Test whether a TCP port is reachable"},
      {cmd:"tcpdump -ni eth0 port 53",desc:"Capture DNS traffic on an interface"},
      {cmd:"openssl s_client -connect host:443 -servername host",desc:"Inspect a remote TLS certificate chain"},
    ]},
  ]},
];

const SCENARIOS = [
  // ── FOUNDATION 5 ────────────────────────────────────────────────────────────
  {id:"onboard-dev",phase:"foundation",title:"Onboard a New Developer",subtitle:"Account, groups, sudo and SSH access",emoji:"👩‍💻",duration:"~30 min",difficulty:"Beginner",examWeight:"High",
   goal:"Give a new developer, priya, a working account with the right groups, limited sudo rights and key-based SSH login.",concepts:["useradd","Groups","sudo","SSH keys","Password ageing"],
   steps:[
    {title:"Create the group and the user",cmds:[
      {cmd:"sudo groupadd developers",why:"A shared group lets you grant access to a team once instead of user by user."},
      {cmd:"sudo useradd -m -s /bin/bash -c 'Priya Shah' -G developers priya",why:"-m creates /home/priya from /etc/skel, -s sets the login shell, -G adds the supplementary group."},
      {cmd:"id priya",why:"Confirms the UID, primary group and that developers appears in the group list."},
    ]},
    {title:"Set a temporary password that must be changed",cmds:[
      {cmd:"sudo passwd priya",why:"Sets the initial password, stored hashed in /etc/shadow."},
      {cmd:"sudo chage -d 0 priya",why:"Sets the last-change date to day 0, forcing a password change at first login."},
      {cmd:"sudo chage -l priya",why:"Verifies the ageing settings: you should see that a password change is required."},
    ]},
    {title:"Grant limited sudo",context:"Developers may restart the app service but must not get full root.",cmds:[
      {cmd:"echo '%developers ALL=(root) /usr/bin/systemctl restart app.service' | sudo tee /etc/sudoers.d/developers",why:"A drop-in file keeps custom rules separate from /etc/sudoers. The % prefix means a group."},
      {cmd:"sudo chmod 440 /etc/sudoers.d/developers && sudo visudo -c",why:"sudo ignores drop-ins with loose permissions, and visudo -c syntax-checks every sudoers file. A broken file can lock everyone out of sudo."},
      {cmd:"sudo -l -U priya",why:"Lists exactly what priya may run, proving the rule took effect."},
    ]},
    {title:"Install her SSH public key",cmds:[
      {cmd:"sudo install -d -m 700 -o priya -g priya /home/priya/.ssh",why:"sshd refuses keys if .ssh is writable by others, so create it with the strict 700 mode and correct owner."},
      {cmd:"echo 'ssh-ed25519 AAAA...key priya@laptop' | sudo tee /home/priya/.ssh/authorized_keys",why:"authorized_keys holds the public keys allowed to log in as this user."},
      {cmd:"sudo chown priya:priya /home/priya/.ssh/authorized_keys && sudo chmod 600 /home/priya/.ssh/authorized_keys",why:"The key file must belong to the user and be private, or StrictModes rejects it."},
    ]},
   ]},
  {id:"log-hunt",phase:"foundation",title:"Hunt Through Logs with Text Tools",subtitle:"grep, awk, sort and uniq on real log files",emoji:"🔎",duration:"~25 min",difficulty:"Beginner",examWeight:"High",
   goal:"Find who is hammering SSH with failed logins and produce a ranked list of attacking IP addresses saved to a report.",concepts:["grep","awk","sort","uniq","Pipes","Redirection"],
   steps:[
    {title:"Locate the authentication log",context:"Debian/Ubuntu write /var/log/auth.log; RHEL-family systems write /var/log/secure. The journal has both.",cmds:[
      {cmd:"ls /var/log/auth.log /var/log/secure 2>/dev/null",why:"Shows which file exists on this distribution; 2>/dev/null hides the error for the one that does not."},
      {cmd:"sudo journalctl -u ssh -u sshd --since today | head",why:"The journal works on every systemd distribution regardless of the log file name."},
    ]},
    {title:"Filter the failed attempts",cmds:[
      {cmd:"sudo grep 'Failed password' /var/log/auth.log | tail -5",why:"grep keeps only matching lines; tail shows the newest few so you can see the format."},
      {cmd:"sudo grep -c 'Failed password' /var/log/auth.log",why:"-c counts matches, giving the scale of the problem."},
    ]},
    {title:"Extract and rank the source IPs",cmds:[
      {cmd:"sudo grep 'Failed password' /var/log/auth.log | grep -oE '([0-9]{1,3}\\.){3}[0-9]{1,3}' | sort | uniq -c | sort -rn | head",why:"-o prints only the matched IP, sort groups identical lines, uniq -c counts each, and sort -rn ranks highest first."},
      {cmd:"sudo awk '/Failed password/ {print $(NF-3)}' /var/log/auth.log | sort | uniq -c | sort -rn | head",why:"The same result with awk: NF is the field count, so $(NF-3) is the IP in the standard sshd message."},
    ]},
    {title:"Save the report",cmds:[
      {cmd:"sudo grep 'Failed password' /var/log/auth.log | grep -oE '([0-9]{1,3}\\.){3}[0-9]{1,3}' | sort | uniq -c | sort -rn > ~/ssh-attackers.txt",why:"> redirects stdout to a file. Exam tasks often ask you to save output to an exact path."},
      {cmd:"wc -l ~/ssh-attackers.txt && head -3 ~/ssh-attackers.txt",why:"Always verify the file exists and has the content you expect."},
    ]},
   ]},
  {id:"team-share",phase:"foundation",title:"Build a Secure Team Share",subtitle:"SGID, sticky bit and default ACLs",emoji:"📁",duration:"~30 min",difficulty:"Intermediate",examWeight:"High",
   goal:"Create /srv/projects where the developers group can collaborate, files keep the group, people cannot delete each other's files, and the auditor user gets read-only access.",concepts:["chmod","SGID","Sticky bit","ACL","Default ACL","umask"],
   steps:[
    {title:"Create the directory with group ownership",cmds:[
      {cmd:"sudo mkdir -p /srv/projects && sudo chgrp developers /srv/projects",why:"The directory's group decides which team gets the group permissions."},
      {cmd:"sudo chmod 2770 /srv/projects",why:"2 sets SGID so new files inherit the developers group; 770 gives full access to owner and group and none to others."},
    ]},
    {title:"Stop users deleting each other's files",cmds:[
      {cmd:"sudo chmod +t /srv/projects",why:"The sticky bit means only a file's owner (or root) can delete or rename it, even though the group can write to the directory."},
      {cmd:"ls -ld /srv/projects",why:"Expect drwxrws--T: s in the group execute slot is SGID, T in the other slot is the sticky bit (capital because others lack x)."},
    ]},
    {title:"Give the auditor read-only access with ACLs",cmds:[
      {cmd:"sudo setfacl -m u:auditor:rx /srv/projects",why:"An ACL adds a named user without changing the owner or group. rx lets them enter and list the directory."},
      {cmd:"sudo setfacl -d -m u:auditor:rx -m g:developers:rwx /srv/projects",why:"Default (-d) ACLs are copied onto new files and subdirectories, so access stays correct as content grows."},
      {cmd:"getfacl /srv/projects",why:"Shows the access and default entries plus the mask, which caps the effective rights of named entries."},
    ]},
    {title:"Test as real users",cmds:[
      {cmd:"sudo -u priya touch /srv/projects/plan.txt && ls -l /srv/projects/plan.txt",why:"The new file's group should be developers thanks to SGID, and ls shows + because ACLs apply."},
      {cmd:"sudo -u auditor touch /srv/projects/x.txt",why:"Should fail with Permission denied: the auditor can read but not write."},
    ]},
   ]},
  {id:"runaway-process",phase:"foundation",title:"Tame a Runaway Process",subtitle:"Find, deprioritise and stop a CPU hog",emoji:"🔥",duration:"~20 min",difficulty:"Beginner",examWeight:"Medium",
   goal:"A process is pinning a CPU. Identify it, lower its priority, then stop it cleanly and only force it if that fails.",concepts:["top","ps","nice","renice","Signals","kill"],
   steps:[
    {title:"Create a safe test hog",cmds:[
      {cmd:"( while :; do :; done ) &",why:"An infinite loop in the background burns one CPU so you can practise without breaking anything. $! holds its PID."},
      {cmd:"echo $!",why:"Prints the PID of the last background job."},
    ]},
    {title:"Identify the culprit",cmds:[
      {cmd:"top -b -n1 -o %CPU | head -15",why:"Batch mode prints one snapshot sorted by CPU, which is useful in scripts or when top's live view is awkward."},
      {cmd:"ps -eo pid,ppid,user,ni,%cpu,cmd --sort=-%cpu | head -5",why:"Custom columns show the PID, parent, owner, nice value and command in one view."},
    ]},
    {title:"Lower its priority",cmds:[
      {cmd:"renice -n 19 -p <pid>",why:"19 is the lowest priority. The process keeps running but yields CPU to everything else."},
      {cmd:"ps -o pid,ni,cmd -p <pid>",why:"Confirms the NI column now shows 19."},
    ]},
    {title:"Stop it the right way",cmds:[
      {cmd:"kill <pid>",why:"With no signal, kill sends SIGTERM (15), letting the program clean up and exit."},
      {cmd:"kill -0 <pid> && kill -9 <pid>",why:"kill -0 only tests whether the PID still exists. Use SIGKILL (9) as a last resort because the process cannot clean up."},
    ]},
   ]},
  {id:"backup-archive",phase:"foundation",title:"Archive and Restore Configuration",subtitle:"tar, find and rsync for a safe backup",emoji:"🗄️",duration:"~25 min",difficulty:"Beginner",examWeight:"Medium",
   goal:"Back up /etc, find the configuration files changed this week, and restore a single file from the archive without overwriting anything else.",concepts:["tar","find","rsync","Compression","Restore"],
   steps:[
    {title:"Create a compressed archive",cmds:[
      {cmd:"sudo tar -czpf /root/etc-$(date +%F).tar.gz /etc",why:"-c create, -z gzip, -p keep permissions, -f filename. $(date +%F) stamps the archive with today's date."},
      {cmd:"sudo tar -tzf /root/etc-$(date +%F).tar.gz | head",why:"Lists the contents to prove the archive is readable. Note tar strips the leading /."},
    ]},
    {title:"Find what changed recently",cmds:[
      {cmd:"sudo find /etc -type f -mtime -7 -ls",why:"-mtime -7 matches files modified less than 7 days ago; -ls prints details for each."},
      {cmd:"sudo find /etc -type f -mtime -7 -print0 | sudo tar -czf /root/etc-recent.tar.gz --null -T -",why:"Archives only the changed files. -print0 and --null handle names containing spaces safely."},
    ]},
    {title:"Restore one file safely",cmds:[
      {cmd:"mkdir -p /tmp/restore && sudo tar -xzf /root/etc-$(date +%F).tar.gz -C /tmp/restore etc/ssh/sshd_config",why:"Extracting into a scratch directory with -C and naming a single member never touches the live /etc."},
      {cmd:"sudo diff /tmp/restore/etc/ssh/sshd_config /etc/ssh/sshd_config",why:"Compare before copying back, so you restore only what you intend."},
    ]},
    {title:"Mirror backups off the server",cmds:[
      {cmd:"sudo rsync -avz /root/etc-*.tar.gz backup@backup01:/backups/$(hostname)/",why:"rsync only transfers what changed, preserves attributes with -a and compresses with -z over SSH."},
    ]},
   ]},

  // ── INTERMEDIATE 5 ──────────────────────────────────────────────────────────
  {id:"deploy-web",phase:"intermediate",title:"Deploy a Web Server as a Service",subtitle:"Package, enable, open the firewall, verify",emoji:"🌐",duration:"~35 min",difficulty:"Beginner",examWeight:"Critical",
   goal:"Install Nginx, make it start at boot, serve a custom page, open the firewall and prove it works from another machine.",concepts:["Package manager","systemctl","firewalld/UFW","journalctl","ss"],
   steps:[
    {title:"Install the package",cmds:[
      {cmd:"sudo dnf install -y nginx    # or: sudo apt update && sudo apt install -y nginx",why:"The package manager resolves dependencies and verifies signatures. Debian systems need apt update first to refresh lists."},
      {cmd:"rpm -ql nginx | grep -E 'conf$|service$'    # or: dpkg -L nginx",why:"Lists the files the package installed, so you know where its config and unit file live."},
    ]},
    {title:"Start it now and at boot",cmds:[
      {cmd:"sudo systemctl enable --now nginx",why:"enable creates the boot-time symlink and --now starts it immediately. Exam graders often reboot or check is-enabled."},
      {cmd:"systemctl is-active nginx && systemctl is-enabled nginx",why:"Two quick yes/no checks for running and enabled."},
      {cmd:"sudo ss -tlnp | grep ':80'",why:"Proves something is listening on port 80 and shows which process owns it."},
    ]},
    {title:"Serve a custom page",cmds:[
      {cmd:"echo \"<h1>Hello from $(hostname)</h1>\" | sudo tee /usr/share/nginx/html/index.html",why:"The default document root on RHEL-family Nginx (Debian uses /var/www/html). tee writes as root, unlike a plain > redirect."},
      {cmd:"curl -s http://localhost",why:"Tests locally first, before involving the network or firewall."},
    ]},
    {title:"Open the firewall",cmds:[
      {cmd:"sudo firewall-cmd --permanent --add-service=http && sudo firewall-cmd --reload",why:"--permanent writes the rule to disk and --reload activates it. Without --permanent the rule disappears on restart."},
      {cmd:"sudo ufw allow 'Nginx HTTP'    # Ubuntu equivalent",why:"UFW application profiles name the ports for you."},
      {cmd:"curl -sI http://<server-ip>    # from another host",why:"A remote test proves the service, firewall and routing all work together."},
    ]},
    {title:"Read the logs when something breaks",cmds:[
      {cmd:"sudo nginx -t",why:"Validates the configuration before reload, so a typo does not take the site down."},
      {cmd:"sudo journalctl -u nginx --since '15 min ago'",why:"Service start-up errors land in the journal; access and error logs are in /var/log/nginx/."},
    ]},
   ]},
  {id:"custom-unit",phase:"intermediate",title:"Write a systemd Service and Timer",subtitle:"Replace a cron job with a logged, managed unit",emoji:"⏲️",duration:"~35 min",difficulty:"Intermediate",examWeight:"Critical",
   goal:"Turn a backup script into a systemd service, run it every night at 01:30 with a timer, and read its output from the journal.",concepts:["Unit files","Type=oneshot","Timers","OnCalendar","daemon-reload"],
   steps:[
    {title:"Create the script",cmds:[
      {cmd:"printf '#!/bin/bash\\nset -euo pipefail\\ntar -czf /var/backups/home-$(date +%%F).tar.gz /home\\necho backup done\\n' | sudo tee /usr/local/bin/home-backup.sh",why:"The shebang picks Bash; set -euo pipefail makes the script stop on errors instead of silently carrying on."},
      {cmd:"sudo chmod 755 /usr/local/bin/home-backup.sh",why:"systemd needs the file to be executable."},
    ]},
    {title:"Write the service unit",context:"Your own units belong in /etc/systemd/system, never in /usr/lib/systemd/system where package updates overwrite files.",cmds:[
      {cmd:"printf '[Unit]\\nDescription=Nightly home backup\\n\\n[Service]\\nType=oneshot\\nExecStart=/usr/local/bin/home-backup.sh\\n' | sudo tee /etc/systemd/system/home-backup.service",why:"Type=oneshot suits a job that runs to completion; systemd waits for it to exit instead of expecting a daemon."},
      {cmd:"sudo systemctl daemon-reload && sudo systemctl start home-backup.service",why:"daemon-reload makes systemd read new or changed unit files. Starting it once proves the service works before scheduling it."},
      {cmd:"journalctl -u home-backup.service -n 5",why:"The echo output and any errors appear here automatically, with no log redirection needed."},
    ]},
    {title:"Schedule it with a timer",cmds:[
      {cmd:"printf '[Unit]\\nDescription=Run home backup nightly\\n\\n[Timer]\\nOnCalendar=*-*-* 01:30:00\\nPersistent=true\\n\\n[Install]\\nWantedBy=timers.target\\n' | sudo tee /etc/systemd/system/home-backup.timer",why:"The timer activates the service with the same name. Persistent=true runs a missed job after the machine was off."},
      {cmd:"systemd-analyze calendar '*-*-* 01:30:00'",why:"Shows the next time the expression will fire, which catches calendar syntax mistakes."},
      {cmd:"sudo systemctl daemon-reload && sudo systemctl enable --now home-backup.timer",why:"You enable the timer, not the service. The timer is what is wanted by timers.target at boot."},
      {cmd:"systemctl list-timers home-backup.timer",why:"Confirms the NEXT and LAST run times."},
    ]},
   ]},
  {id:"new-disk",phase:"intermediate",title:"Add a Disk and Mount it Permanently",subtitle:"Partition, format and fstab by UUID",emoji:"💽",duration:"~30 min",difficulty:"Intermediate",examWeight:"Critical",
   goal:"A new 20 GiB disk, /dev/sdb, has been attached. Partition it, create an XFS filesystem and mount it at /data so it survives reboots.",concepts:["lsblk","parted","mkfs","UUID","fstab","mount -a"],
   steps:[
    {title:"Identify the new disk",cmds:[
      {cmd:"lsblk",why:"The new disk shows with no partitions or mount points. Always double-check the name before writing to it."},
      {cmd:"sudo wipefs /dev/sdb",why:"Lists any existing signatures. An empty result means the disk really is blank."},
    ]},
    {title:"Partition it",cmds:[
      {cmd:"sudo parted -s /dev/sdb mklabel gpt mkpart data xfs 1MiB 100%",why:"Creates a GPT label and one partition using the whole disk. Starting at 1MiB keeps the partition correctly aligned."},
      {cmd:"lsblk /dev/sdb",why:"sdb1 should now appear."},
    ]},
    {title:"Create the filesystem",cmds:[
      {cmd:"sudo mkfs.xfs -L data /dev/sdb1",why:"Formats the partition with XFS and a label. Use mkfs.ext4 if the task asks for ext4."},
      {cmd:"sudo blkid /dev/sdb1",why:"Shows the UUID you will put in fstab."},
    ]},
    {title:"Mount persistently and verify safely",context:"A broken fstab line can stop the server booting. Test before you reboot.",cmds:[
      {cmd:"sudo mkdir -p /data && echo \"UUID=$(sudo blkid -s UUID -o value /dev/sdb1) /data xfs defaults 0 0\" | sudo tee -a /etc/fstab",why:"Using UUID survives device renaming. -a appends rather than overwriting the whole file."},
      {cmd:"sudo systemctl daemon-reload && sudo findmnt --verify",why:"systemd generates mount units from fstab; findmnt --verify checks every line for errors."},
      {cmd:"sudo mount -a && df -hT /data",why:"mount -a mounts everything in fstab. If it succeeds now, it will succeed at boot."},
    ]},
   ]},
  {id:"lvm-grow",phase:"intermediate",title:"Grow a Full Filesystem with LVM",subtitle:"Add a disk and extend online, with no downtime",emoji:"📈",duration:"~30 min",difficulty:"Intermediate",examWeight:"Critical",
   goal:"/var/lib/app (logical volume app_lv in volume group data_vg) is 95% full. Add new disk /dev/sdc and grow the filesystem by 10 GiB while the app keeps running.",concepts:["pvcreate","vgextend","lvextend -r","xfs_growfs","resize2fs"],
   steps:[
    {title:"Check the current layout",cmds:[
      {cmd:"df -h /var/lib/app && sudo lvs && sudo vgs",why:"Confirms which LV backs the mount and how much free space (VFree) the volume group has."},
    ]},
    {title:"Add the new disk to the volume group",cmds:[
      {cmd:"sudo pvcreate /dev/sdc",why:"Writes the LVM physical volume header. A whole disk can be used without partitioning."},
      {cmd:"sudo vgextend data_vg /dev/sdc && sudo vgs data_vg",why:"Adds the PV to the pool; VFree should increase by about the disk size."},
    ]},
    {title:"Extend the volume and filesystem together",cmds:[
      {cmd:"sudo lvextend -r -L +10G /dev/data_vg/app_lv",why:"-r resizes the filesystem in the same step, calling xfs_growfs or resize2fs for you. Forgetting it is the classic mistake: the LV grows but df does not."},
      {cmd:"df -h /var/lib/app",why:"The extra 10 GiB is now available, with no unmount needed."},
    ]},
    {title:"If you forgot -r",cmds:[
      {cmd:"sudo xfs_growfs /var/lib/app",why:"XFS grows by mount point. It can never be shrunk."},
      {cmd:"sudo resize2fs /dev/data_vg/app_lv",why:"ext4 grows by device and can grow online; shrinking ext4 requires unmounting first."},
    ]},
   ]},
  {id:"static-net",phase:"intermediate",title:"Configure Static Networking and DNS",subtitle:"nmcli, hostname, routes and name resolution",emoji:"🛰️",duration:"~30 min",difficulty:"Intermediate",examWeight:"Critical",
   goal:"Give web01 a static IPv4 and IPv6 address, gateway and DNS servers, add a route to a backend network, and make all of it persistent.",concepts:["nmcli","IPv4/IPv6","Default gateway","DNS","Static routes","hostnamectl"],
   steps:[
    {title:"Inspect the current state",cmds:[
      {cmd:"ip -br addr && ip route",why:"Shows interfaces, addresses and the default route before you change anything."},
      {cmd:"nmcli con show",why:"Lists NetworkManager connection profiles. You modify the profile, not the device."},
    ]},
    {title:"Set the static addresses",cmds:[
      {cmd:"sudo nmcli con mod 'System eth0' ipv4.method manual ipv4.addresses 192.168.10.20/24 ipv4.gateway 192.168.10.1 ipv4.dns '192.168.10.2 1.1.1.1'",why:"method manual turns DHCP off. Values are written to the profile on disk, so they survive reboots."},
      {cmd:"sudo nmcli con mod 'System eth0' ipv6.method manual ipv6.addresses 2001:db8:10::20/64 ipv6.gateway 2001:db8:10::1",why:"IPv6 is configured the same way under the ipv6.* properties."},
      {cmd:"sudo nmcli con up 'System eth0'",why:"Re-activates the profile so the changes take effect now. On a remote session, double-check the values first."},
    ]},
    {title:"Add a persistent static route",cmds:[
      {cmd:"sudo nmcli con mod 'System eth0' +ipv4.routes '10.50.0.0/16 192.168.10.254'",why:"The + appends to the route list. A plain ip route add would vanish at reboot."},
      {cmd:"sudo nmcli con up 'System eth0' && ip route get 10.50.1.1",why:"ip route get shows which gateway and interface the kernel will actually use."},
    ]},
    {title:"Set the hostname and verify name resolution",cmds:[
      {cmd:"sudo hostnamectl set-hostname web01.example.com",why:"Writes /etc/hostname and updates the running hostname in one step."},
      {cmd:"echo '192.168.10.30 db01.example.com db01' | sudo tee -a /etc/hosts",why:"A static entry, checked before DNS by default (see the hosts line in /etc/nsswitch.conf)."},
      {cmd:"getent hosts db01 && dig +short example.com",why:"getent follows the real system lookup order; dig queries DNS directly."},
    ]},
   ]},

  // ── ADVANCED 6 ──────────────────────────────────────────────────────────────
  {id:"ssh-harden",phase:"advanced",title:"Harden SSH Access",subtitle:"Keys only, no root, custom port",emoji:"🔐",duration:"~35 min",difficulty:"Intermediate",examWeight:"Critical",
   goal:"Allow only key-based logins, block direct root login and move SSH to port 2222, updating SELinux and the firewall so you do not lock yourself out.",concepts:["sshd_config","SSH keys","SELinux ports","firewalld","sshd -t"],
   steps:[
    {title:"Set up key login first",context:"Keep your current session open until the very end. Test new logins in a second terminal.",cmds:[
      {cmd:"ssh-keygen -t ed25519 -C 'admin@laptop'",why:"Ed25519 keys are short, fast and strong. Protect the private key with a passphrase."},
      {cmd:"ssh-copy-id -i ~/.ssh/id_ed25519.pub admin@web01",why:"Appends the public key to the server's authorized_keys with the right permissions."},
      {cmd:"ssh -o PasswordAuthentication=no admin@web01 true && echo key-login-ok",why:"Proves key login works before you disable passwords."},
    ]},
    {title:"Harden the server configuration",cmds:[
      {cmd:"printf 'Port 2222\\nPermitRootLogin no\\nPasswordAuthentication no\\nAllowUsers admin priya\\n' | sudo tee /etc/ssh/sshd_config.d/10-hardening.conf",why:"Drop-ins in sshd_config.d are read first, and for most settings the first value wins, so this overrides the defaults cleanly."},
      {cmd:"sudo sshd -t",why:"Tests the configuration. Never reload sshd without this; a syntax error can stop it starting."},
    ]},
    {title:"Allow the new port through SELinux and the firewall",cmds:[
      {cmd:"sudo semanage port -a -t ssh_port_t -p tcp 2222",why:"SELinux only lets sshd bind to ports labelled ssh_port_t. Without this, sshd fails to start on 2222."},
      {cmd:"sudo firewall-cmd --permanent --add-port=2222/tcp && sudo firewall-cmd --reload",why:"Opens the new port before you switch, so the next connection is not blocked."},
      {cmd:"sudo systemctl reload sshd",why:"Reload applies the config without killing existing sessions."},
    ]},
    {title:"Verify, then close the old door",cmds:[
      {cmd:"ssh -p 2222 admin@web01 'echo hardened-ok'",why:"Test from a second terminal before closing your original session."},
      {cmd:"sudo firewall-cmd --permanent --remove-service=ssh && sudo firewall-cmd --reload",why:"Only after the new port works, remove the old port 22 rule."},
    ]},
   ]},
  {id:"selinux-web",phase:"advanced",title:"Fix an SELinux Denial",subtitle:"Custom docroot and a backend connection",emoji:"🛡️",duration:"~35 min",difficulty:"Advanced",examWeight:"Critical",
   goal:"Nginx returns 403 for a site served from /srv/web and cannot reach a backend on port 8080. Fix both without disabling SELinux.",concepts:["ls -Z","semanage fcontext","restorecon","Booleans","ausearch"],
   steps:[
    {title:"Confirm SELinux is the cause",cmds:[
      {cmd:"getenforce",why:"Enforcing means policy is being applied. Never fix a problem by running setenforce 0 permanently."},
      {cmd:"sudo ausearch -m AVC -ts recent | tail",why:"AVC denials name the process type (httpd_t), the target and the permission that was refused."},
      {cmd:"ls -Zd /srv/web /usr/share/nginx/html",why:"Compare labels: the default docroot is httpd_sys_content_t, but /srv/web is var_t, which Nginx may not read."},
    ]},
    {title:"Label the content persistently",cmds:[
      {cmd:"sudo semanage fcontext -a -t httpd_sys_content_t '/srv/web(/.*)?'",why:"Adds a rule to the policy's file-context database. The regex covers the directory and everything below it."},
      {cmd:"sudo restorecon -Rv /srv/web",why:"Applies the rule to existing files. chcon would also work, but it is undone by the next relabel."},
      {cmd:"curl -sI http://localhost/ | head -1",why:"The 403 should now be a 200."},
    ]},
    {title:"Allow the backend connection",cmds:[
      {cmd:"getsebool -a | grep httpd_can_network",why:"Booleans are pre-built optional rules. httpd_can_network_connect controls outbound connections from the web server."},
      {cmd:"sudo setsebool -P httpd_can_network_connect on",why:"-P makes it permanent; without it the change is lost at reboot."},
    ]},
    {title:"If a port label is the issue",cmds:[
      {cmd:"sudo semanage port -l | grep http_port_t",why:"Lists the ports the web server may bind to."},
      {cmd:"sudo semanage port -a -t http_port_t -p tcp 8081",why:"Needed if Nginx itself must listen on a non-standard port."},
    ]},
   ]},
  {id:"nat-gateway",phase:"advanced",title:"Build a NAT Gateway with Port Forwarding",subtitle:"ip_forward, masquerade and DNAT",emoji:"🔀",duration:"~40 min",difficulty:"Advanced",examWeight:"High",
   goal:"Let hosts on the internal 10.0.0.0/24 network reach the internet through gw01, and forward gw01's port 8080 to an internal web server at 10.0.0.50:80.",concepts:["sysctl","Masquerade","Port forwarding","firewalld zones","nftables"],
   steps:[
    {title:"Enable routing in the kernel",cmds:[
      {cmd:"echo 'net.ipv4.ip_forward = 1' | sudo tee /etc/sysctl.d/90-ip-forward.conf",why:"A drop-in in /etc/sysctl.d makes the setting survive reboots."},
      {cmd:"sudo sysctl --system && sysctl net.ipv4.ip_forward",why:"Loads all sysctl files now and confirms the value is 1."},
    ]},
    {title:"Place interfaces in zones",cmds:[
      {cmd:"sudo firewall-cmd --permanent --zone=external --change-interface=eth0",why:"The external zone faces the internet and has masquerading enabled by default."},
      {cmd:"sudo firewall-cmd --permanent --zone=internal --change-interface=eth1",why:"The internal zone is the trusted LAN side."},
    ]},
    {title:"Masquerade and forward the port",cmds:[
      {cmd:"sudo firewall-cmd --permanent --zone=external --add-masquerade",why:"Rewrites internal source addresses to gw01's public address. Already on for the external zone, but explicit is clearer."},
      {cmd:"sudo firewall-cmd --permanent --zone=external --add-forward-port=port=8080:proto=tcp:toport=80:toaddr=10.0.0.50",why:"DNAT: connections to gw01:8080 are sent to 10.0.0.50:80."},
      {cmd:"sudo firewall-cmd --reload && sudo firewall-cmd --zone=external --list-all",why:"Activates the permanent rules and shows them for verification."},
    ]},
    {title:"Verify end to end",cmds:[
      {cmd:"curl -sI http://<gw01-public-ip>:8080    # from outside",why:"Should return the internal web server's response."},
      {cmd:"sudo nft list ruleset | grep -iE 'masquerade|dnat'",why:"firewalld renders everything to nftables. Seeing the raw rules helps when debugging."},
    ]},
   ]},
  {id:"container-service",phase:"advanced",title:"Run a Container as a Boot-time Service",subtitle:"Podman, persistent storage and systemd",emoji:"📦",duration:"~35 min",difficulty:"Intermediate",examWeight:"High",
   goal:"Run an Nginx container with content from the host, publish it on port 8080, and make it start automatically at boot.",concepts:["podman run","Volumes","Port mapping","Quadlet","systemd"],
   steps:[
    {title:"Run and test the container",cmds:[
      {cmd:"sudo mkdir -p /srv/site && echo 'container ok' | sudo tee /srv/site/index.html",why:"Content on the host survives container replacement, unlike files written inside the container."},
      {cmd:"sudo podman run -d --name site -p 8080:80 -v /srv/site:/usr/share/nginx/html:Z docker.io/library/nginx",why:"-d detaches, -p maps host 8080 to container 80, and :Z relabels the directory for SELinux so the container may read it."},
      {cmd:"curl -s localhost:8080 && sudo podman ps",why:"Confirms the page is served and the container is Up."},
    ]},
    {title:"Inspect and debug",cmds:[
      {cmd:"sudo podman logs site",why:"Shows the container's stdout and stderr."},
      {cmd:"sudo podman exec -it site sh -c 'nginx -t'",why:"Runs a command inside the running container."},
    ]},
    {title:"Hand it to systemd with Quadlet",context:"Podman 4.4+ reads .container files and generates a systemd service. Older versions use podman generate systemd.",cmds:[
      {cmd:"sudo podman rm -f site",why:"Remove the hand-started container; systemd will own the new one."},
      {cmd:"printf '[Container]\\nImage=docker.io/library/nginx\\nPublishPort=8080:80\\nVolume=/srv/site:/usr/share/nginx/html:Z\\n\\n[Install]\\nWantedBy=multi-user.target\\n' | sudo tee /etc/containers/systemd/site.container",why:"A Quadlet file describes the container declaratively; the generated unit is called site.service."},
      {cmd:"sudo systemctl daemon-reload && sudo systemctl start site.service",why:"daemon-reload runs the Quadlet generator. The [Install] section means it also starts at boot."},
      {cmd:"systemctl status site.service --no-pager && curl -s localhost:8080",why:"systemd now restarts it on failure and starts it at boot."},
    ]},
   ]},
  {id:"disk-full",phase:"advanced",title:"Disk Full at 3 AM",subtitle:"Find and safely reclaim space under pressure",emoji:"🚨",duration:"~30 min",difficulty:"Advanced",examWeight:"Critical",
   goal:"An alert says / is 100% full and services are failing. Find the cause and free space safely, including space held by deleted files and an inode exhaustion trap.",concepts:["df","du","lsof","Inodes","journalctl --vacuum","logrotate"],
   steps:[
    {title:"Confirm what is full",cmds:[
      {cmd:"df -hT",why:"Shows which filesystem is full, so you do not clean the wrong one."},
      {cmd:"df -i",why:"A filesystem can also run out of inodes, with space free but no room for new files. Millions of tiny files cause this."},
    ]},
    {title:"Find the biggest directories",cmds:[
      {cmd:"sudo du -xh --max-depth=1 / 2>/dev/null | sort -h | tail",why:"-x stays on one filesystem so other mounts are not counted. Repeat one level deeper on the largest result."},
      {cmd:"sudo find / -xdev -type f -size +500M -exec ls -lh {} + 2>/dev/null",why:"Lists individual very large files."},
    ]},
    {title:"Catch space held by deleted files",cmds:[
      {cmd:"sudo lsof -nP +L1 | grep -i deleted",why:"A file deleted while a process still has it open keeps using space until the process closes it. df and du disagree when this happens."},
      {cmd:"sudo systemctl restart <service-holding-the-file>",why:"Restarting the owner releases the space. Alternatively, truncate the file through /proc/<pid>/fd/<n>."},
    ]},
    {title:"Reclaim log space safely",cmds:[
      {cmd:"sudo journalctl --disk-usage && sudo journalctl --vacuum-size=500M",why:"Shrinks the journal to 500 MB. Set SystemMaxUse= in journald.conf so it stays capped."},
      {cmd:"sudo truncate -s 0 /var/log/app/huge.log",why:"Truncating empties a log in place, so the app keeps writing to the same file. Deleting it would hold the space until restart."},
      {cmd:"sudo logrotate -f /etc/logrotate.conf",why:"Forces a rotation so compression and retention rules apply now."},
    ]},
   ]},
  {id:"boot-rescue",phase:"advanced",title:"Recover a Server That Won't Boot",subtitle:"Emergency mode after a bad fstab edit",emoji:"🩹",duration:"~30 min",difficulty:"Advanced",examWeight:"High",
   goal:"After someone added a typo to /etc/fstab the server drops into emergency mode. Fix it from the console, check the filesystem and boot normally.",concepts:["Emergency mode","fstab","Remount","fsck/xfs_repair","GRUB"],
   steps:[
    {title:"Get a shell",context:"In emergency mode you are prompted for the root password. If root is locked, add systemd.unit=emergency.target or rd.break to the kernel line in GRUB (press e).",cmds:[
      {cmd:"journalctl -xb | grep -iE 'mount|fstab|failed' | tail",why:"Shows which mount failed and why, usually a wrong UUID, a typo or a missing device."},
      {cmd:"mount -o remount,rw /",why:"The root filesystem is often read-only in emergency mode; you need it writable to fix fstab."},
    ]},
    {title:"Fix fstab",cmds:[
      {cmd:"lsblk -f",why:"Shows the real UUIDs and filesystem types so you can compare them with fstab."},
      {cmd:"vi /etc/fstab",why:"Correct the bad line or comment it out with #. For non-critical mounts, the nofail option stops a missing disk blocking boot."},
      {cmd:"systemctl daemon-reload && mount -a && findmnt --verify",why:"Proves every entry now mounts cleanly before you reboot."},
    ]},
    {title:"Check the filesystem if it was damaged",cmds:[
      {cmd:"umount /data && xfs_repair /dev/sdb1",why:"Repairs must run on an unmounted filesystem. Running them on a mounted one can cause corruption."},
      {cmd:"e2fsck -f /dev/sdc1",why:"The ext4 equivalent; -f forces a full check even if the filesystem looks clean."},
    ]},
    {title:"Boot normally",cmds:[
      {cmd:"systemctl default",why:"Leaves emergency mode and continues to the default target. A reboot also works."},
      {cmd:"systemctl --failed",why:"After boot, confirm no units failed."},
    ]},
   ]},
];

const PHASES = [
  {
    id:"foundation",level:"BASIC",title:"Foundation",subtitle:"Zero → Confident at the Shell",duration:"Weeks 1–4",
    color:T.cyan,icon:"$_",badge:"L1",
    topics:[
      {title:"The Shell & Filesystem Hierarchy",
       keywords:["Linux kernel","shell","Bash","FHS","root user","PATH","stdin","stdout","stderr","exit code","environment variable"],
       explanation:`Linux is a kernel plus a large set of tools. The Linux kernel talks to the hardware; everything you type goes through a shell, the program that reads commands and starts other programs. On almost every server that shell is Bash.

THE FILESYSTEM HIERARCHY (FHS): Linux has one tree rooted at /. There are no drive letters. Disks are attached (mounted) somewhere inside the tree.
• /etc → system-wide configuration (text files you will edit constantly)
• /var → data that changes: logs in /var/log, mail, caches, databases
• /home → users' personal directories; /root is the root user's home
• /usr → installed programs and libraries (/usr/bin, /usr/lib)
• /tmp → temporary files, often wiped at boot
• /dev → device files such as /dev/sda; /proc and /sys → live kernel information
• /boot → kernel and bootloader files; /opt and /srv → add-on software and served data

HOW COMMANDS ARE FOUND: When you type a command, Bash checks aliases and builtins, then searches each directory listed in the PATH environment variable. type and which tell you which one will run.

STREAMS: Every program has three standard streams. stdin (0) is input, stdout (1) is normal output, stderr (2) is errors. You can redirect them: > overwrites a file, >> appends, 2> captures errors, and 2>&1 sends errors to the same place as output. A pipe | connects one command's stdout to the next command's stdin. This is how small tools combine into powerful one-liners.

EXIT CODES: Every command returns an exit code. 0 means success; anything else means failure. $? holds the last one. && runs the next command only on success, || only on failure.

GETTING HELP: man <command> is your best friend in the exam because external websites are not allowed. man -k searches descriptions, --help gives a quick summary, and /usr/share/doc holds examples.`,
       subtopics:["One tree rooted at /: the FHS directories and what lives where","Absolute vs relative paths, . and ..","How Bash finds commands through PATH","stdin, stdout, stderr and redirection","Pipes and exit codes: |, &&, ||","man, man -k and --help as your offline documentation"],
       commands:[
         {cmd:"pwd; cd /var/log; cd -",desc:"Show, change and toggle back to the previous directory."},
         {cmd:"ls -lah /etc | less",desc:"Long listing including hidden files, paged."},
         {cmd:"type ls cd grep",desc:"Shows whether each is an alias, builtin or file on disk."},
         {cmd:"echo $PATH",desc:"Directories Bash searches for commands."},
         {cmd:"find /etc -name '*.conf' 2>/dev/null | wc -l",desc:"Count matches while discarding error messages."},
         {cmd:"man -k partition",desc:"Find the right man page when you do not know the command name."},
       ],
       resources:[
         {title:"Filesystem Hierarchy Standard 3.0",url:"https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html"},
         {title:"GNU Bash Reference Manual",url:"https://www.gnu.org/software/bash/manual/bash.html"},
       ]},
      {title:"Files, Links & Text Processing",
       keywords:["inode","hard link","symbolic link","regular expression"],
       explanation:`Admins spend their days creating, finding and transforming text files. Master a handful of tools and you can answer almost any question about a system.

FILES AND INODES: A file's data and metadata (owner, permissions, timestamps, size) live in an inode. A filename is just a directory entry pointing to that inode. ls -i shows inode numbers.
• A hard link is a second name for the same inode. Delete one name and the data remains. Hard links cannot cross filesystems or point to directories.
• A symbolic link (ln -s) is a tiny file containing a path. It can point anywhere, including directories and other filesystems, but breaks if the target moves.

FINDING FILES: find walks the tree and tests each file: -name, -type f/d/l, -size +100M, -mtime -7 (modified in the last 7 days), -user, -perm. It can act on matches with -exec ... {} + or -delete. locate is faster but uses a database that may be out of date.

SEARCHING TEXT: grep prints matching lines. -i ignores case, -r searches directories, -n shows line numbers, -v inverts the match, -c counts, -E enables extended regular expression syntax and -o prints only the matching part.

REGULAR EXPRESSIONS: ^ anchors the start of a line, $ the end, . matches any character, * repeats the previous item, [abc] is a character set and \\b a word boundary. With -E you also get +, ? , | and () grouping.

TRANSFORMING TEXT:
• sed edits streams: sed 's/old/new/g' replaces text; -i edits the file in place; sed -n '5,10p' prints a range of lines.
• awk splits lines into fields: awk -F: '{print $1}' prints the first colon-separated field; conditions like '$3>=1000' filter rows.
• cut, sort, uniq, wc, head, tail and tr finish the toolbox. sort | uniq -c | sort -rn is the classic way to count and rank.

ARCHIVES: tar bundles files (-c create, -x extract, -t list, -f file) and adds compression with -z (gzip), -j (bzip2) or -J (xz). Always check what will be extracted with -t first, and use -C to choose the destination.`,
       subtopics:["Inodes, hard links and symbolic links","find by name, type, size, time, owner and permission","grep options and regular expressions","sed for substitution, awk for fields","sort, uniq, cut, wc, head and tail pipelines","tar archives with gzip, bzip2 and xz"],
       commands:[
         {cmd:"ln -s /etc/nginx/nginx.conf ~/nginx.conf",desc:"Symbolic link in your home directory."},
         {cmd:"find / -type f -size +100M -mtime -7 2>/dev/null",desc:"Large files changed in the last week."},
         {cmd:"grep -rniE 'error|fail' /var/log/syslog",desc:"Case-insensitive search for either word, with line numbers."},
         {cmd:"sed -i.bak 's/^#Port 22/Port 2222/' sshd_config",desc:"Edit in place and keep a .bak copy."},
         {cmd:"awk -F: '$7 ~ /bash/ {print $1}' /etc/passwd",desc:"Users whose login shell is Bash."},
         {cmd:"tar -cJf logs.tar.xz /var/log/*.log",desc:"Archive with xz compression."},
       ],
       resources:[
         {title:"GNU findutils manual",url:"https://www.gnu.org/software/findutils/manual/html_mono/find.html"},
         {title:"GNU sed manual",url:"https://www.gnu.org/software/sed/manual/sed.html"},
         {title:"The GNU Awk User's Guide",url:"https://www.gnu.org/software/gawk/manual/gawk.html"},
       ]},
      {title:"Users, Groups & sudo",
       keywords:["UID","GID","root user","sudo","PAM","environment variable","LDAP","SSSD"],
       explanation:`Every process runs as a user, and every file is owned by a user and a group. Managing accounts well is the foundation of a secure system.

WHERE ACCOUNTS LIVE:
• /etc/passwd → one line per account: name:x:UID:GID:comment:home:shell. Readable by everyone.
• /etc/shadow → password hashes and ageing data. Readable only by root.
• /etc/group → groups and their members; /etc/gshadow holds group passwords.
The kernel only cares about numbers: the UID and GID. Names are a convenience. UID 0 is the root user. System accounts usually have UIDs below 1000 and often have /sbin/nologin as their shell.

MANAGING ACCOUNTS: useradd -m creates a user with a home directory copied from /etc/skel. usermod changes users; the most common mistake is usermod -G without -a, which replaces all supplementary groups instead of adding one. userdel -r deletes the user and their home. groupadd, groupmod and gpasswd manage groups. Defaults come from /etc/login.defs and /etc/default/useradd.

PASSWORDS AND AGEING: passwd sets passwords. chage controls ageing: -M maximum days, -m minimum days, -W warning days, -E account expiry date, and -d 0 forces a change at next login. passwd -l locks an account; usermod -s /sbin/nologin blocks interactive logins.

SUDO: Instead of sharing the root password, sudo lets users run specific commands as root, with every use logged. Rules live in /etc/sudoers and drop-in files under /etc/sudoers.d/. Always edit them with visudo, which checks syntax before saving. A broken sudoers file can lock everyone out of administrator access. %wheel (RHEL) or %sudo (Debian/Ubuntu) groups usually have full sudo rights.

ENVIRONMENT PROFILES: Login shells read /etc/profile and /etc/profile.d/*.sh (system-wide), then ~/.bash_profile or ~/.profile. Interactive non-login shells read ~/.bashrc. Put a system-wide environment variable in /etc/profile.d/ and a personal one in ~/.bashrc.

CENTRAL IDENTITY: In larger environments accounts come from an LDAP directory instead of local files. SSSD connects the machine to LDAP, FreeIPA or Active Directory, and /etc/nsswitch.conf decides where name lookups go. PAM, configured in /etc/pam.d, controls how authentication and session setup work.`,
       subtopics:["/etc/passwd, /etc/shadow and /etc/group fields","useradd, usermod -aG, userdel -r","Password ageing with chage; locking accounts","sudo, visudo and /etc/sudoers.d drop-ins","System-wide vs personal environment profiles","LDAP clients with SSSD and nsswitch.conf"],
       commands:[
         {cmd:"useradd -m -s /bin/bash -G wheel alice",desc:"New user with home directory, shell and supplementary group."},
         {cmd:"usermod -aG developers alice",desc:"Add a group without removing existing ones."},
         {cmd:"chage -M 90 -W 7 -E 2026-12-31 alice",desc:"90-day max password age, 7-day warning, account expiry date."},
         {cmd:"getent passwd alice",desc:"Look up a user from any source (local files or LDAP)."},
         {cmd:"visudo -f /etc/sudoers.d/webadmins",desc:"Edit a sudo drop-in with syntax checking."},
         {cmd:"su - alice",desc:"Switch to alice with a full login environment."},
       ],
       resources:[
         {title:"Red Hat — Managing users and groups",url:"https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_basic_system_settings/managing-users-and-groups_configuring-basic-system-settings"},
         {title:"Sudo manual",url:"https://www.sudo.ws/docs/man/sudoers.man/"},
       ]},
      {title:"Permissions, ACLs & Special Bits",
       keywords:["umask","SUID","SGID","sticky bit","ACL","root user"],
       explanation:`Linux permissions decide who can read, write and execute each file. Getting them right is a large part of both security and day-to-day troubleshooting.

THE BASIC MODEL: Each file has an owner, a group and three permission sets: user (u), group (g) and other (o). Each set has read (r=4), write (w=2) and execute (x=1). ls -l shows them as -rwxr-x---, which is 750 in octal.
On directories the bits mean something slightly different: r lists names, w creates and deletes entries, and x lets you enter the directory and reach files inside it. A directory without x is effectively closed even if r is set.

CHANGING THEM: chmod 640 file or chmod u+x,g-w,o= file. chown user:group file changes ownership (only root can give files away). chgrp changes just the group. -R applies changes recursively.

UMASK: New files start from 666 and new directories from 777, then the umask removes bits. The common umask 022 gives 644 files and 755 directories; 027 gives 640 and 750. Set it per user in ~/.bashrc or system-wide in /etc/profile or login.defs.

SPECIAL BITS:
• SUID (4xxx) on an executable: runs with the owner's privileges. /usr/bin/passwd is SUID root so users can update /etc/shadow. Unexpected SUID files are a security red flag.
• SGID (2xxx) on a directory: new files inherit the directory's group, perfect for shared team folders. On an executable it runs with the file's group.
• sticky bit (1xxx) on a directory: only a file's owner (or the root user) can delete or rename it. /tmp is 1777.
ls shows them as s or S in the execute position (S means the bit is set but execute is not) and t or T for the sticky bit.

ACCESS CONTROL LISTS: Standard permissions allow only one owner and one group. An ACL adds entries for extra named users and groups. setfacl -m u:bob:rw file grants bob access; setfacl -x removes an entry; getfacl shows them. Default ACLs (setfacl -d) on a directory are inherited by new files created inside it. The ACL mask limits the maximum effective permissions of all named entries and the group, so check it if an ACL seems to be ignored. A + at the end of ls -l permissions means an ACL is present.`,
       subtopics:["rwx on files vs directories","Octal and symbolic chmod; chown and chgrp","umask and default permissions","SUID, SGID and sticky bit — what each is for","ACLs: setfacl, getfacl, default ACLs and the mask","Finding risky permissions with find -perm"],
       commands:[
         {cmd:"chmod 2775 /srv/team",desc:"SGID shared directory, group-writable."},
         {cmd:"chmod u=rwx,g=rx,o= deploy.sh",desc:"Symbolic form of 750."},
         {cmd:"chown -R www-data:www-data /var/www/site",desc:"Recursive ownership change."},
         {cmd:"setfacl -m u:bob:rw report.txt",desc:"Give bob read/write without changing the group."},
         {cmd:"setfacl -R -d -m g:ops:rwX /srv/ops",desc:"Default ACL (X = execute only on directories)."},
         {cmd:"find / -xdev -perm -2000 -type f",desc:"List SGID files on the root filesystem."},
       ],
       resources:[
         {title:"chmod — GNU coreutils",url:"https://www.gnu.org/software/coreutils/manual/html_node/chmod-invocation.html"},
         {title:"Arch Wiki — Access Control Lists",url:"https://wiki.archlinux.org/title/Access_Control_Lists"},
       ]},
      {title:"Processes, Signals & Job Control",
       keywords:["PID","signal","daemon","nice value","zombie process","OOM killer","load average","systemd"],
       explanation:`A process is a running program. Knowing how to see, prioritise and stop processes is essential for keeping systems healthy.

WHAT A PROCESS IS: Each process has a PID, a parent (PPID), an owner, a state and resource usage. PID 1 is systemd, the ancestor of everything else. A daemon is a long-running background process such as sshd or crond.

PROCESS STATES: R running or runnable, S sleeping (waiting for something), D uninterruptible sleep (usually waiting on disk or NFS; many D processes signal an I/O problem), T stopped, and Z zombie. A zombie process has exited but its parent has not read its exit status. It uses no resources apart from a table slot; fix or restart the parent.

VIEWING PROCESSES:
• ps aux or ps -ef → snapshot of all processes. ps -eo pid,user,%cpu,%mem,cmd --sort=-%cpu customises columns.
• top or htop → live view. In top, P sorts by CPU, M by memory, k kills, r renices.
• pgrep / pidof → find PIDs by name; pstree shows the hierarchy.
• uptime shows the load average over 1, 5 and 15 minutes. Compare it with the number of CPUs from nproc.

SIGNALS: kill sends a signal, not necessarily death. SIGTERM (15, the default) politely asks a process to exit. SIGKILL (9) cannot be caught or ignored, so the process gets no chance to clean up; use it last. SIGHUP (1) traditionally tells daemons to reload configuration. SIGSTOP and SIGCONT pause and resume. pkill and killall target processes by name or user.

PRIORITY: The nice value ranges from -20 (most favoured) to 19 (least). nice -n 10 cmd starts a process with lower priority; renice changes a running one. Only root can lower a nice value.

JOB CONTROL: Append & to run a command in the background. Ctrl+Z suspends the foreground job; bg resumes it in the background, fg brings it back, and jobs lists them. nohup or a systemd service keeps work running after you log out.

MEMORY PRESSURE: When RAM and swap run out, the kernel's OOM killer terminates a process to save the system. Check dmesg or journalctl -k for "Out of memory" messages when a process vanishes unexpectedly.`,
       subtopics:["PID, PPID, owner and process states (R, S, D, Z)","ps, top, pgrep and pstree","Signals: SIGTERM vs SIGKILL vs SIGHUP","nice and renice","Background jobs: &, Ctrl+Z, bg, fg, jobs, nohup","Load average and the OOM killer"],
       commands:[
         {cmd:"ps -eo pid,ppid,user,stat,%cpu,%mem,cmd --sort=-%mem | head",desc:"Top memory users with state and parent."},
         {cmd:"pstree -p",desc:"Process tree with PIDs."},
         {cmd:"kill -HUP $(pidof rsyslogd)",desc:"Ask a daemon to reload its configuration."},
         {cmd:"nice -n 15 tar czf /tmp/big.tgz /data &",desc:"Start a low-priority background job."},
         {cmd:"renice -n 5 -u alice",desc:"Lower priority for all of alice's processes."},
         {cmd:"journalctl -k | grep -i 'out of memory'",desc:"Check whether the OOM killer struck."},
       ],
       resources:[
         {title:"man 7 signal",url:"https://man7.org/linux/man-pages/man7/signal.7.html"},
         {title:"procps-ng (ps, top) documentation",url:"https://gitlab.com/procps-ng/procps"},
       ]},
    ],
    labs:[
      {title:"Lab 1: Shell Navigation & Redirection",difficulty:"Easy",desc:"Explore the FHS: count the .conf files under /etc, save the list to ~/conf-list.txt and the error messages to ~/errors.txt in a single command. Find which directory in PATH provides the ip command. Append today's date to ~/conf-list.txt.",solution:"find /etc -name '*.conf' > ~/conf-list.txt 2> ~/errors.txt\nwc -l ~/conf-list.txt\ntype -a ip\ndate >> ~/conf-list.txt\ntail -1 ~/conf-list.txt"},
      {title:"Lab 2: Text Processing Pipeline",difficulty:"Medium",desc:"From /etc/passwd list every user whose UID is 1000 or above with their home directory, sorted by UID. Count how many accounts use /sbin/nologin. Replace every occurrence of 'staging' with 'production' in a copy of a config file, keeping a backup.",solution:"awk -F: '$3>=1000 {print $3, $1, $6}' /etc/passwd | sort -n\ngrep -c '/sbin/nologin$' /etc/passwd\ncp app.conf /tmp/app.conf\nsed -i.bak 's/staging/production/g' /tmp/app.conf\ndiff /tmp/app.conf.bak /tmp/app.conf"},
      {title:"Lab 3: Accounts & sudo",difficulty:"Medium",desc:"Create group webteam (GID 5000) and users dev1 and dev2 in it. Make dev1's password expire every 60 days and dev2's account expire on the last day of the year. Allow webteam to restart httpd with sudo only. Lock dev2.",solution:"groupadd -g 5000 webteam\nuseradd -m -G webteam dev1 && useradd -m -G webteam dev2\nchage -M 60 dev1\nchage -E 2026-12-31 dev2\necho '%webteam ALL=(root) /usr/bin/systemctl restart httpd' > /etc/sudoers.d/webteam\nchmod 440 /etc/sudoers.d/webteam && visudo -c\npasswd -l dev2\nchage -l dev1"},
      {title:"Lab 4: Permissions Puzzle",difficulty:"Medium",desc:"Create /srv/finance owned by group finance with SGID so files inherit the group. Others get no access. Give user auditor read-only access with ACLs, including to files created later. Find every SUID file on the system and save the list.",solution:"groupadd finance\nmkdir /srv/finance && chgrp finance /srv/finance\nchmod 2770 /srv/finance\nsetfacl -m u:auditor:rx /srv/finance\nsetfacl -d -m u:auditor:rx /srv/finance\ngetfacl /srv/finance\nfind / -xdev -perm -4000 -type f > /root/suid-files.txt 2>/dev/null"},
      {title:"Lab 5: Process Control",difficulty:"Easy",desc:"Start three sleep 1000 jobs in the background. List them with jobs and ps. Renice one to 19, suspend and resume another, and terminate all three, using SIGTERM first. Find the five processes using the most memory.",solution:"sleep 1000 & sleep 1000 & sleep 1000 &\njobs -l\nps -o pid,ni,cmd -C sleep\nrenice -n 19 -p <pid1>\nkill -STOP <pid2> && kill -CONT <pid2>\npkill -TERM sleep\nps aux --sort=-%mem | head -6"},
    ],
    assessment:{title:"L1 Foundation Quiz",questions:[
      {q:"Which directory holds system-wide configuration files?",options:["/var","/etc","/usr","/opt"],answer:1,explain:"/etc holds host-specific configuration. /var holds changing data such as logs, /usr holds installed software, /opt holds add-on packages."},
      {q:"What does 2>&1 do in 'cmd > out.txt 2>&1'?",options:["Sends output to file descriptor 2","Sends stderr to the same place as stdout","Discards errors","Runs cmd twice"],answer:1,explain:"2>&1 redirects stderr (2) to wherever stdout (1) currently points, so both end up in out.txt."},
      {q:"A command finished successfully. What is in $?",options:["1","0","-1","The PID"],answer:1,explain:"An exit code of 0 means success. Any non-zero value indicates an error."},
      {q:"Which statement about hard links is true?",options:["They can point to directories","They can cross filesystems","They share the same inode as the original","They break when the original name is deleted"],answer:2,explain:"A hard link is another name for the same inode. The data survives until the last link is removed. Hard links cannot cross filesystems or link directories."},
      {q:"Which find expression matches files modified within the last 3 days?",options:["-mtime +3","-mtime -3","-atime 3","-newer 3"],answer:1,explain:"-mtime -3 means less than 3 days ago. +3 means more than 3 days ago."},
      {q:"What does 'sed -i s/foo/bar/g file' do?",options:["Prints lines containing foo","Replaces every foo with bar inside the file","Replaces only the first foo in the file","Counts foo occurrences"],answer:1,explain:"-i edits in place, s substitutes, and g replaces every match on each line rather than just the first."},
      {q:"Why is 'usermod -G devs alice' dangerous?",options:["It deletes alice","It removes alice from all her other supplementary groups","It changes her primary group","It locks the account"],answer:1,explain:"Without -a, -G replaces the whole supplementary group list. Use usermod -aG devs alice to add a group."},
      {q:"Which file stores password hashes?",options:["/etc/passwd","/etc/shadow","/etc/group","/etc/login.defs"],answer:1,explain:"/etc/shadow holds hashes and ageing data and is readable only by root. /etc/passwd shows an x in the password field."},
      {q:"How should you edit sudo rules?",options:["nano /etc/sudoers","visudo","sudo -e /etc/passwd","chmod 777 /etc/sudoers"],answer:1,explain:"visudo locks the file and checks syntax before saving, preventing a broken file that locks out sudo."},
      {q:"What are the permissions of a new file with umask 027?",options:["640","750","644","600"],answer:0,explain:"Files start from 666. Removing 027 gives 640 (rw-r-----). Directories start from 777 and become 750."},
      {q:"What does the SGID bit do on a directory?",options:["Runs files as the group","New files inherit the directory's group","Only owners can delete files","Hides the directory"],answer:1,explain:"SGID on a directory makes new files inherit its group, which is ideal for shared team folders."},
      {q:"ls -l shows drwxrwxrwt. What does the t mean?",options:["Temporary directory","Sticky bit: only owners can delete their files","SUID","The directory is a link"],answer:1,explain:"t in the other-execute slot is the sticky bit, used on /tmp so users cannot delete each other's files."},
      {q:"An ACL grants bob rwx, but he can only read. What is the most likely cause?",options:["ACLs are disabled","The ACL mask limits effective permissions to r","bob is not in the owning group","The sticky bit is set"],answer:1,explain:"The mask caps the effective rights of named users and groups. getfacl shows #effective: when the mask restricts an entry."},
      {q:"Which signal is sent by kill with no options?",options:["SIGKILL (9)","SIGTERM (15)","SIGHUP (1)","SIGSTOP (19)"],answer:1,explain:"kill defaults to SIGTERM, which asks the process to exit cleanly. SIGKILL should be a last resort."},
      {q:"Many processes are in state D. What does that usually indicate?",options:["They are zombies","They are waiting on I/O such as a slow disk or NFS","They are using too much CPU","They were stopped with Ctrl+Z"],answer:1,explain:"D is uninterruptible sleep, normally waiting for storage or network filesystem I/O. Many D processes point to an I/O problem."},
    ]}
  },

  {
    id:"intermediate",level:"INTERMEDIATE",title:"Core Administration",subtitle:"Services, Storage & Networking",duration:"Weeks 5–8",
    color:T.violet,icon:"⚙",badge:"L2",
    topics:[
      {title:"systemd Services & Logging",
       keywords:["systemd","unit file","journald","journalctl","daemon"],
       explanation:`systemd starts the system, supervises services and collects their logs. Almost every Operations task in the exam touches it.

UNITS: systemd manages units, each described by a unit file. The most common types are .service (a daemon or job), .timer (a schedule), .mount, .socket and .target (a group of units, like a runlevel).
• Vendor unit files live in /usr/lib/systemd/system. Do not edit them; package updates overwrite them.
• Your own units and overrides go in /etc/systemd/system, which takes priority.
• systemctl edit <unit> creates a drop-in override (/etc/systemd/system/<unit>.d/override.conf) so you change only what you need.
After creating or editing unit files, run systemctl daemon-reload so systemd reads them again.

EVERYDAY COMMANDS:
• systemctl start | stop | restart | reload <unit> → act now
• systemctl enable | disable <unit> → start (or not) at boot; enable --now does both
• systemctl status <unit> → state, main PID, recent log lines
• systemctl is-active / is-enabled / is-failed → scriptable checks
• systemctl mask <unit> → make it impossible to start, even manually or as a dependency
• systemctl list-units --failed and systemctl --failed → find broken things fast

ANATOMY OF A SERVICE: [Unit] holds Description and ordering (After=, Requires=, Wants=). [Service] holds Type= (simple, forking, oneshot, notify), ExecStart=, User=, Restart=on-failure and Environment=. [Install] holds WantedBy=multi-user.target, which is what enable hooks into.

TARGETS AND BOOT: multi-user.target is a normal server boot; graphical.target adds a desktop; rescue.target and emergency.target are for repairs. systemctl get-default and set-default change the boot target. systemctl isolate switches immediately.

LOGGING: journald captures kernel messages, early boot output and everything services write to stdout and stderr. journalctl reads it:
• -u nginx (one unit), -b (this boot), -b -1 (previous boot), -p err (priority err and worse), -f (follow), --since "1 hour ago", -k (kernel only), -o json-pretty (full fields)
By default the journal may be in memory only (/run/log/journal). Creating /var/log/journal or setting Storage=persistent in /etc/systemd/journald.conf keeps logs across reboots. Traditional text logs (/var/log/messages, /var/log/syslog, /var/log/secure, /var/log/auth.log) come from rsyslog where it is installed, and logrotate keeps them from filling the disk.`,
       subtopics:["Unit types: service, timer, mount, socket, target","Vendor units vs /etc/systemd/system and drop-in overrides","start/stop vs enable/disable vs mask","Writing a service: Type, ExecStart, Restart, WantedBy","Boot targets: multi-user, graphical, rescue, emergency","journalctl filters and persistent journals; rsyslog and logrotate"],
       commands:[
         {cmd:"systemctl enable --now chronyd",desc:"Start a service now and at boot."},
         {cmd:"systemctl edit nginx",desc:"Create a drop-in override for a vendor unit."},
         {cmd:"systemctl cat sshd",desc:"Show the unit file plus any drop-ins."},
         {cmd:"systemctl list-dependencies multi-user.target",desc:"What a target pulls in."},
         {cmd:"journalctl -u sshd -b -p warning",desc:"Warnings and worse for sshd since boot."},
         {cmd:"mkdir -p /var/log/journal && systemctl restart systemd-journald",desc:"Make the journal persistent."},
       ],
       resources:[
         {title:"systemd.service man page",url:"https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html"},
         {title:"journalctl man page",url:"https://www.freedesktop.org/software/systemd/man/latest/journalctl.html"},
       ]},
      {title:"Packages & Scheduled Jobs",
       keywords:["package manager","APT","DNF","repository","cron","systemd timer"],
       explanation:`Software installation and job scheduling are routine admin tasks. The LFCS exam is distribution-agnostic, so know both the Debian and the Red Hat families.

PACKAGE MANAGERS: A package manager installs software from a repository, resolves dependencies, verifies signatures and tracks every file it installs.
• Debian/Ubuntu → APT (apt update, apt install, apt remove, apt purge, apt upgrade, apt search, apt show) on top of dpkg (dpkg -l, dpkg -L pkg, dpkg -S /path).
• RHEL/Fedora/Rocky/Alma → DNF (dnf install, remove, upgrade, search, info, provides, history) on top of rpm (rpm -qa, rpm -ql pkg, rpm -qf /path, rpm -V pkg).
Remember apt update before installing on Debian systems: it refreshes the package lists. dnf provides */semanage and apt-file search tell you which package contains a missing command.

REPOSITORIES: APT sources live in /etc/apt/sources.list and /etc/apt/sources.list.d/; DNF repos in /etc/yum.repos.d/*.repo. Third-party repositories need their signing key. dnf config-manager --add-repo or a .list file adds one.

BUILDING FROM SOURCE: Occasionally software is not packaged. The classic flow is ./configure, make, sudo make install, which installs into /usr/local. You need build tools (build-essential or the Development Tools group). Packages are always preferred because they can be updated and removed cleanly.

CRON: The cron daemon runs commands on a schedule. crontab -e edits your table; crontab -l lists it; crontab -u alice -e edits another user's. Each line has five time fields then the command:
minute (0-59) · hour (0-23) · day of month (1-31) · month (1-12) · day of week (0-7, 0 and 7 are Sunday)
So 30 2 * * 1-5 means 02:30 on weekdays, and */15 * * * * means every 15 minutes. System jobs go in /etc/crontab or /etc/cron.d/ files, which include a user field. /etc/cron.daily and friends run scripts via anacron. Cron runs with a minimal environment, so use full paths.

AT: at runs a one-off job: echo "cmd" | at 22:00 or at now + 1 hour. atq lists jobs and atrm removes them.

SYSTEMD TIMERS: A systemd timer (.timer unit) activates a matching .service. OnCalendar=Mon..Fri 02:30 is calendar-based; OnBootSec= and OnUnitActiveSec= are relative. Persistent=true runs missed jobs after downtime. Timers log to the journal and can use every systemd feature, which is why they are replacing cron. systemctl list-timers shows the schedule.`,
       subtopics:["APT/dpkg vs DNF/rpm command equivalents","Repositories and signing keys","Which package provides a file or command?","Building from source: configure, make, make install","cron syntax, user vs system crontabs, at","systemd timers: OnCalendar, Persistent, list-timers"],
       commands:[
         {cmd:"apt update && apt install -y nginx",desc:"Refresh package lists, then install (Debian/Ubuntu)."},
         {cmd:"dnf install -y nginx",desc:"Install on RHEL-family systems."},
         {cmd:"rpm -qf /usr/bin/ss  |  dpkg -S /usr/bin/ss",desc:"Which package owns a file."},
         {cmd:"dnf history undo last",desc:"Roll back the last DNF transaction."},
         {cmd:"echo '0 3 * * 0 root /usr/local/bin/cleanup.sh' > /etc/cron.d/cleanup",desc:"System cron job every Sunday at 03:00."},
         {cmd:"systemctl list-timers --all",desc:"Every timer with its last and next run."},
       ],
       resources:[
         {title:"Debian Reference — Package management",url:"https://www.debian.org/doc/manuals/debian-reference/ch02.en.html"},
         {title:"DNF command reference",url:"https://dnf.readthedocs.io/en/latest/command_ref.html"},
         {title:"systemd.timer man page",url:"https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html"},
       ]},
      {title:"Disks, Filesystems & Swap",
       keywords:["GPT","ext4","XFS","fstab","UUID","swap","tmpfs","RAID"],
       explanation:`Storage is 20% of the LFCS. You must be able to take a blank disk all the way to a persistent, mounted filesystem without breaking the boot process.

DISCOVERING DISKS: lsblk shows block devices as a tree (disks, partitions, LVM volumes). lsblk -f adds filesystem type, label, UUID and mount point. blkid prints UUIDs. Disks appear as /dev/sda, /dev/vdb or /dev/nvme0n1.

PARTITIONING: GPT is the modern partition table (large disks, many partitions); MBR is legacy. Tools: fdisk and gdisk (interactive), parted (scriptable: parted -s /dev/sdb mklabel gpt mkpart data 1MiB 100%). Run partprobe or check lsblk if the kernel does not see new partitions.

FILESYSTEMS:
• ext4 → default on Debian/Ubuntu. mkfs.ext4; grows online and shrinks offline with resize2fs; repaired with e2fsck; tuned with tune2fs.
• XFS → default on RHEL. mkfs.xfs; grows online with xfs_growfs (by mount point) but can never shrink; repaired with xfs_repair.
• Others: Btrfs, vfat (EFI system partition), tmpfs (RAM-backed).
Filesystem checks and repairs must run on unmounted filesystems.

MOUNTING: mount /dev/sdb1 /data attaches a filesystem; umount detaches it ("target is busy" means a process is using it; find it with lsof or fuser -vm). Options such as ro, noexec, nosuid and nodev harden mounts.

PERSISTENT MOUNTS: /etc/fstab has six fields: device, mount point, type, options, dump, fsck order. Always use UUID= (or LABEL=) because /dev/sdX names can change between boots. After editing, run systemctl daemon-reload, findmnt --verify and mount -a. If mount -a works, boot will work. Add nofail for non-essential disks so a missing disk does not drop the system into emergency mode.

SWAP: swap is overflow memory on disk. Create it with mkswap on a partition or a file (fallocate -l 2G /swapfile; chmod 600; mkswap; swapon), and make it permanent with an fstab line using type swap and mount point none. swapon --show and free -h display it. vm.swappiness controls how eagerly the kernel uses it.

VIRTUAL FILESYSTEMS: /proc and /sys are generated by the kernel, and tmpfs lives in memory. You can mount tmpfs with a size limit, for example for a fast scratch directory.

SOFTWARE RAID: mdadm builds RAID arrays from disks: RAID 1 mirrors, RAID 5 survives one disk failure with parity, RAID 10 mirrors and stripes. cat /proc/mdstat shows array health.`,
       subtopics:["lsblk, blkid and device naming","GPT partitioning with parted, fdisk and gdisk","ext4 vs XFS: create, grow, repair","mount, umount and hardening options","fstab by UUID, findmnt --verify and nofail","Swap partitions and files; tmpfs; mdadm RAID basics"],
       commands:[
         {cmd:"lsblk -f",desc:"Devices with filesystems, UUIDs and mount points."},
         {cmd:"parted -s /dev/sdb mklabel gpt mkpart p1 1MiB 50% mkpart p2 50% 100%",desc:"Two partitions in one command."},
         {cmd:"mkfs.ext4 -L backups /dev/sdb2",desc:"ext4 filesystem with a label."},
         {cmd:"echo 'UUID=<uuid> /backups ext4 defaults,nofail 0 2' >> /etc/fstab",desc:"Persistent mount that will not block boot."},
         {cmd:"fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile",desc:"Create and enable a swap file."},
         {cmd:"mount -t tmpfs -o size=512M tmpfs /mnt/scratch",desc:"RAM-backed scratch space."},
       ],
       resources:[
         {title:"Arch Wiki — fstab",url:"https://wiki.archlinux.org/title/Fstab"},
         {title:"Red Hat — Managing file systems",url:"https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_file_systems/index"},
       ]},
      {title:"LVM, NFS & Automounting",
       keywords:["LVM","physical volume","volume group","logical volume","NFS","autofs","XFS","ext4"],
       explanation:`Real servers need storage that can grow without downtime and data shared across machines. LVM and network filesystems solve both.

WHY LVM: Partitions are fixed. LVM adds a flexible layer between disks and filesystems:
• physical volume (PV) → a disk or partition prepared with pvcreate
• volume group (VG) → a pool built from one or more PVs with vgcreate
• logical volume (LV) → a virtual partition carved from the pool with lvcreate, formatted and mounted like any block device
LVs appear as /dev/<vg>/<lv> and /dev/mapper/<vg>-<lv>.

GROWING STORAGE: When a filesystem fills up, add a disk (pvcreate, vgextend) and then grow the LV and filesystem together with lvextend -r -L +10G /dev/vg/lv. The -r flag runs xfs_growfs or resize2fs for you. Without it, the LV grows but df still shows the old size. XFS can only grow. ext4 can shrink, but only while unmounted, and you must shrink the filesystem before the LV (lvreduce -r does both in the right order).

OTHER LVM FEATURES: -l 100%FREE uses all remaining space; snapshots (lvcreate -s) capture a point in time for backups; pvmove migrates data off a disk so you can remove it with vgreduce. pvs, vgs and lvs give quick summaries; pvdisplay, vgdisplay and lvdisplay give details.

NFS: NFS shares a directory over the network.
• Server: install nfs-utils (RHEL) or nfs-kernel-server (Debian), add a line to /etc/exports such as /srv/share 192.168.10.0/24(rw,sync,root_squash), run exportfs -rav, enable nfs-server and open the nfs service in the firewall.
• Client: mount -t nfs server:/srv/share /mnt/share, or an fstab line with type nfs and the _netdev option so it waits for the network.
root_squash maps remote root to an unprivileged user, which is an important safety default. showmount -e server lists exports.

AUTOMOUNTING: autofs mounts filesystems on demand when someone accesses a path, then unmounts them after an idle period. This avoids boot delays and stale mounts.
• /etc/auto.master (or a file in /etc/auto.master.d/) maps a base directory to a map file: /shares /etc/auto.shares
• /etc/auto.shares lists keys: projects -rw,soft nfs01:/srv/projects
Accessing /shares/projects triggers the mount. Wildcard maps (* nfs01:/home/&) handle home directories. systemd can also automount with x-systemd.automount in fstab.

NETWORK BLOCK DEVICES: iSCSI presents a remote disk as a local block device (iscsiadm). Unlike NFS, the client puts its own filesystem on it, and only one client should normally mount it at a time.`,
       subtopics:["PV → VG → LV: the LVM layers","Creating and extending LVs with lvextend -r","Shrinking ext4 safely; XFS cannot shrink","Snapshots, pvmove and vgreduce","NFS server exports and client mounts (_netdev, root_squash)","autofs master and map files; iSCSI basics"],
       commands:[
         {cmd:"pvcreate /dev/sdb /dev/sdc && vgcreate vg_data /dev/sdb /dev/sdc",desc:"Build a volume group from two disks."},
         {cmd:"lvcreate -n lv_web -l 100%FREE vg_data && mkfs.xfs /dev/vg_data/lv_web",desc:"Use all free space for one LV and format it."},
         {cmd:"lvextend -r -L +5G /dev/vg_data/lv_web",desc:"Grow LV and filesystem online."},
         {cmd:"echo '/srv/share 10.0.0.0/24(rw,sync,root_squash)' >> /etc/exports && exportfs -rav",desc:"Publish an NFS export."},
         {cmd:"echo 'nfs01:/srv/share /mnt/share nfs defaults,_netdev 0 0' >> /etc/fstab",desc:"Persistent NFS client mount."},
         {cmd:"echo '/shares /etc/auto.shares' >> /etc/auto.master && systemctl enable --now autofs",desc:"Set up an autofs base directory."},
       ],
       resources:[
         {title:"Red Hat — Configuring and managing LVM",url:"https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_and_managing_logical_volumes/index"},
         {title:"Arch Wiki — NFS",url:"https://wiki.archlinux.org/title/NFS"},
         {title:"Arch Wiki — autofs",url:"https://wiki.archlinux.org/title/Autofs"},
       ]},
      {title:"Networking Essentials",
       keywords:["CIDR","default gateway","DNS","/etc/hosts","NetworkManager","nmcli","Netplan","NTP","chrony"],
       explanation:`Networking is 25% of the LFCS. You need to configure addresses, routes and name resolution persistently, then prove they work.

ADDRESSING BASICS: An address in CIDR form such as 192.168.10.20/24 combines the host address and the network prefix. /24 means 256 addresses (254 usable hosts). Hosts on the same subnet talk directly; anything else goes to the default gateway. IPv6 works the same way with longer addresses (2001:db8::20/64) and usually also has an automatic link-local address (fe80::).

THE ip COMMAND (runtime, not persistent):
• ip addr / ip -br a → addresses; ip link → interfaces and state
• ip route → routing table; ip route get 8.8.8.8 → which route a packet will take
• ip route add 10.50.0.0/16 via 192.168.10.254 → add a route (lost at reboot)
Changes made with ip disappear at reboot. Persistent configuration belongs to the network manager.

PERSISTENT CONFIGURATION:
• NetworkManager (RHEL, Fedora, many others): nmcli con show, nmcli con mod <profile> ipv4.method manual ipv4.addresses ... ipv4.gateway ... ipv4.dns ..., then nmcli con up <profile>. nmtui is a text menu alternative.
• Netplan (Ubuntu): YAML files in /etc/netplan/ rendered to systemd-networkd or NetworkManager. netplan try applies with automatic rollback if you lose access; netplan apply makes it permanent.

NAME RESOLUTION: /etc/nsswitch.conf sets the lookup order (usually files then dns). /etc/hosts holds static entries. DNS servers are listed in /etc/resolv.conf, which is often managed by systemd-resolved (resolvectl status) or NetworkManager, so set DNS through those rather than editing the file directly. hostnamectl set-hostname sets the hostname persistently.
Test with getent hosts name (uses the real system order), dig or host (DNS only), and ping.

TIME SYNCHRONISATION: Wrong clocks break TLS, logs and authentication. NTP keeps time correct; chrony is the usual client and server. timedatectl shows the time zone and sync status; timedatectl set-timezone and set-ntp true configure it. chronyc sources -v shows which servers you are using. Add server or pool lines in chrony.conf to choose time servers.

TROUBLESHOOTING METHOD: Work up the layers. Is the link up (ip link)? Is there an address (ip a)? Can you reach the gateway (ping)? Is the route right (ip route get)? Does DNS resolve (getent hosts)? Is the service listening (ss -tulpn)? Is a firewall blocking it? tracepath shows where packets stop, and tcpdump shows what actually crosses the wire.`,
       subtopics:["CIDR notation, subnets and the default gateway","ip addr, ip link, ip route (runtime only)","Persistent config with nmcli and Netplan","Hostnames, /etc/hosts, nsswitch.conf and DNS resolvers","Time sync with chrony and timedatectl","A layered troubleshooting method: link → IP → route → DNS → port"],
       commands:[
         {cmd:"ip -br a && ip route",desc:"Quick view of addresses and routes."},
         {cmd:"nmcli con mod eth0 ipv4.method manual ipv4.addresses 10.0.0.10/24 ipv4.gateway 10.0.0.1 ipv4.dns 10.0.0.2",desc:"Static IPv4 with NetworkManager."},
         {cmd:"nmcli con mod eth0 +ipv4.routes '172.16.0.0/16 10.0.0.254' && nmcli con up eth0",desc:"Persistent extra route."},
         {cmd:"hostnamectl set-hostname app01.lab.local",desc:"Set the hostname permanently."},
         {cmd:"timedatectl set-timezone Asia/Karachi && timedatectl set-ntp true",desc:"Time zone and NTP synchronisation."},
         {cmd:"chronyc sources -v",desc:"Which time servers are in use and how good they are."},
       ],
       resources:[
         {title:"nmcli examples (man nmcli-examples)",url:"https://networkmanager.dev/docs/api/latest/nmcli-examples.html"},
         {title:"Netplan documentation",url:"https://netplan.readthedocs.io/en/stable/"},
         {title:"chrony documentation",url:"https://chrony-project.org/documentation.html"},
       ]},
    ],
    labs:[
      {title:"Lab 6: Write Your Own Service",difficulty:"Medium",desc:"Create /usr/local/bin/heartbeat.sh that appends the date to /var/log/heartbeat.log every 30 seconds in a loop. Wrap it in a systemd service that restarts on failure and starts at boot. Kill the process and watch systemd restart it.",solution:"printf '#!/bin/bash\\nwhile true; do date >> /var/log/heartbeat.log; sleep 30; done\\n' > /usr/local/bin/heartbeat.sh\nchmod 755 /usr/local/bin/heartbeat.sh\nprintf '[Unit]\\nDescription=Heartbeat\\n[Service]\\nExecStart=/usr/local/bin/heartbeat.sh\\nRestart=on-failure\\n[Install]\\nWantedBy=multi-user.target\\n' > /etc/systemd/system/heartbeat.service\nsystemctl daemon-reload && systemctl enable --now heartbeat\nkill -9 $(systemctl show -p MainPID --value heartbeat)\nsystemctl status heartbeat"},
      {title:"Lab 7: Packages & Schedules",difficulty:"Easy",desc:"Find which package provides the semanage command and install it. Schedule a cron job for user alice that runs df -h > /tmp/df.txt every weekday at 07:45. Schedule a one-off job to reboot at 23:00 tonight, then cancel it.",solution:"dnf provides '*/semanage'   # or: apt-file search bin/semanage\ndnf install -y policycoreutils-python-utils\n(crontab -u alice -l 2>/dev/null; echo '45 7 * * 1-5 /usr/bin/df -h > /tmp/df.txt') | crontab -u alice -\necho 'systemctl reboot' | at 23:00\natq\natrm <job-number>"},
      {title:"Lab 8: Disk to Mount Point",difficulty:"Medium",desc:"On a spare disk create two GPT partitions: 1 GiB ext4 mounted at /archive and the rest as swap. Mount both persistently by UUID, verify fstab without rebooting, and confirm the swap is active.",solution:"parted -s /dev/sdb mklabel gpt mkpart arch 1MiB 1025MiB mkpart swap 1025MiB 100%\nmkfs.ext4 /dev/sdb1 && mkswap /dev/sdb2\nmkdir /archive\necho \"UUID=$(blkid -s UUID -o value /dev/sdb1) /archive ext4 defaults 0 2\" >> /etc/fstab\necho \"UUID=$(blkid -s UUID -o value /dev/sdb2) none swap defaults 0 0\" >> /etc/fstab\nsystemctl daemon-reload && findmnt --verify\nmount -a && swapon -a\nswapon --show; df -h /archive"},
      {title:"Lab 9: LVM End to End",difficulty:"Hard",desc:"Build volume group vg_lab from two disks. Create a 2 GiB XFS LV mounted at /lab persistently. Fill some data, extend the LV by 1 GiB online, then add a third disk to the VG and move all data off the first disk with pvmove and remove it.",solution:"pvcreate /dev/sdb /dev/sdc && vgcreate vg_lab /dev/sdb /dev/sdc\nlvcreate -n lv_lab -L 2G vg_lab && mkfs.xfs /dev/vg_lab/lv_lab\nmkdir /lab && echo '/dev/vg_lab/lv_lab /lab xfs defaults 0 0' >> /etc/fstab && mount -a\nlvextend -r -L +1G /dev/vg_lab/lv_lab\npvcreate /dev/sdd && vgextend vg_lab /dev/sdd\npvmove /dev/sdb && vgreduce vg_lab /dev/sdb && pvremove /dev/sdb\nlvs; pvs; df -h /lab"},
      {title:"Lab 10: Network Configuration",difficulty:"Hard",desc:"Set a static IPv4 and IPv6 address with gateway and two DNS servers using nmcli. Add a persistent route to 172.20.0.0/16. Set the hostname, add an /etc/hosts entry for a database server, and configure chrony to use pool.ntp.org. Verify each step.",solution:"nmcli con mod eth0 ipv4.method manual ipv4.addresses 10.0.0.10/24 ipv4.gateway 10.0.0.1 ipv4.dns '10.0.0.2 1.1.1.1'\nnmcli con mod eth0 ipv6.method manual ipv6.addresses 2001:db8::10/64\nnmcli con mod eth0 +ipv4.routes '172.20.0.0/16 10.0.0.254'\nnmcli con up eth0 && ip route get 172.20.1.1\nhostnamectl set-hostname app01.lab.local\necho '10.0.0.30 db01.lab.local db01' >> /etc/hosts && getent hosts db01\necho 'pool pool.ntp.org iburst' >> /etc/chrony.conf && systemctl restart chronyd && chronyc sources"},
    ],
    assessment:{title:"L2 Core Administration Quiz",questions:[
      {q:"You edited /etc/systemd/system/app.service. What must you run before restarting it?",options:["systemctl reboot","systemctl daemon-reload","systemctl reset-failed","journalctl --rotate"],answer:1,explain:"daemon-reload makes systemd re-read unit files. Without it systemd keeps using the old definition."},
      {q:"What is the difference between systemctl enable and start?",options:["None","enable configures start at boot; start runs it now","start configures boot; enable runs now","enable also installs the package"],answer:1,explain:"enable hooks the unit into a target for boot. start runs it immediately. enable --now does both."},
      {q:"Where should you put a custom override for a vendor-supplied unit?",options:["Edit /usr/lib/systemd/system/<unit> directly","A drop-in in /etc/systemd/system/<unit>.d/ (systemctl edit)","/etc/init.d","/var/lib/systemd"],answer:1,explain:"Files in /usr/lib are overwritten by package updates. Drop-ins in /etc/systemd/system/<unit>.d/ survive and override only what you change."},
      {q:"Which command shows errors from the previous boot?",options:["journalctl -b -1 -p err","journalctl -k -f","dmesg --previous","systemctl --failed -1"],answer:0,explain:"-b -1 selects the previous boot and -p err filters to error priority and above. This needs a persistent journal."},
      {q:"What does systemctl mask do?",options:["Hides a unit from list-units","Prevents a unit from being started at all, even manually","Disables logging for a unit","Restarts a unit on failure"],answer:1,explain:"mask links the unit to /dev/null so nothing can start it, not even a dependency, until it is unmasked."},
      {q:"On Debian/Ubuntu, what should you run before apt install on a fresh system?",options:["apt upgrade","apt update","dpkg --configure -a","apt clean"],answer:1,explain:"apt update refreshes the package lists from the repositories; otherwise APT may not find the package or may try outdated versions."},
      {q:"Which command shows which RPM package owns /usr/sbin/sshd?",options:["rpm -ql sshd","rpm -qf /usr/sbin/sshd","dnf search sshd","rpm -V sshd"],answer:1,explain:"rpm -qf (query file) names the owning package. On Debian the equivalent is dpkg -S."},
      {q:"What schedule does '*/10 9-17 * * 1-5' describe?",options:["Every 10 hours on weekends","Every 10 minutes from 09:00 to 17:59 on weekdays","At 09:10 and 17:10 daily","Every 10 days in summer"],answer:1,explain:"Minute */10 (every 10 minutes), hours 9 to 17, any day of month, any month, Monday to Friday."},
      {q:"In a systemd timer, what does Persistent=true do?",options:["Keeps the timer after reboot","Runs a missed job when the system starts if it was off at the scheduled time","Keeps logs forever","Prevents the timer being stopped"],answer:1,explain:"Persistent=true records the last run on disk and catches up on missed runs, similar to anacron."},
      {q:"Why should /etc/fstab use UUID= instead of /dev/sdb1?",options:["UUIDs mount faster","Device names can change between boots; UUIDs do not","fstab does not accept /dev names","UUIDs enable encryption"],answer:1,explain:"Adding or reordering disks can rename /dev/sdX. The filesystem UUID stays the same."},
      {q:"Which filesystem can be grown online but never shrunk?",options:["ext4","XFS","vfat","tmpfs"],answer:1,explain:"XFS supports online growth with xfs_growfs but has no shrink operation. ext4 can shrink while unmounted."},
      {q:"You ran lvextend -L +5G on an LV but df shows no change. What did you forget?",options:["vgextend","Resizing the filesystem (use -r or xfs_growfs/resize2fs)","Remounting read-only","pvcreate"],answer:1,explain:"lvextend grows the block device only. -r, or a separate xfs_growfs or resize2fs, grows the filesystem on top."},
      {q:"Which option should an NFS fstab entry include so it waits for the network at boot?",options:["noauto","_netdev","nofail only","sync"],answer:1,explain:"_netdev marks the mount as needing the network, so systemd orders it after network-online.target."},
      {q:"You add an address with 'ip addr add'. What happens after a reboot?",options:["It persists","It is lost; use nmcli or Netplan for persistence","It moves to the loopback","It becomes DHCP"],answer:1,explain:"The ip command changes only the running kernel state. Persistent settings come from NetworkManager, Netplan or systemd-networkd."},
      {q:"Which command resolves a name using the system's configured order (hosts file, then DNS)?",options:["dig","nslookup","getent hosts","host"],answer:2,explain:"getent uses nsswitch.conf, so it checks /etc/hosts and DNS as the system would. dig, host and nslookup query DNS only."},
    ]}
  },

  {
    id:"advanced",level:"ADVANCED",title:"Production Grade",subtitle:"Security, Automation & Operations",duration:"Weeks 9–12",
    color:T.amber,icon:"⚡",badge:"L3",
    topics:[
      {title:"SSH, Firewalls & Traffic Control",
       keywords:["OpenSSH","SSH key","sshd_config","nftables","firewalld","UFW","NAT","port forwarding","network bond","network bridge","reverse proxy","Nginx","HAProxy","sysctl"],
       explanation:`Remote access and traffic control are core Networking competencies. A careless change here can lock you out, so always test before closing your existing session.

OPENSSH CLIENT: The OpenSSH client connects with ssh user@host; -p sets the port, -i picks a key, -J jumps through a bastion. Per-host settings go in ~/.ssh/config (Host, HostName, User, Port, IdentityFile). scp and sftp copy files; rsync -e ssh syncs efficiently.

SSH KEYS: ssh-keygen -t ed25519 creates a key pair. ssh-copy-id installs the public key in the server's ~/.ssh/authorized_keys. Permissions matter: ~/.ssh must be 700 and authorized_keys 600, or the server ignores them. An SSH key with a passphrase plus ssh-agent gives both security and convenience.

OPENSSH SERVER: sshd reads /etc/ssh/sshd_config and drop-ins in /etc/ssh/sshd_config.d/. Common hardening in sshd_config: PermitRootLogin no, PasswordAuthentication no, AllowUsers or AllowGroups, a non-default Port, and MaxAuthTries. Always run sshd -t before systemctl reload sshd. A reload keeps existing sessions alive. On SELinux systems a new port also needs semanage port -a -t ssh_port_t.

PACKET FILTERING: The kernel's firewall is nftables (iptables commands on modern systems are usually a compatibility layer on top of it). Most admins use a front end:
• firewalld (RHEL family): zones (public, internal, external...) hold allowed services and ports. firewall-cmd --add-service=https --permanent then --reload. Without --permanent, changes are lost at reload or reboot; without --reload, permanent changes are not active yet.
• UFW (Ubuntu): ufw allow 443/tcp, ufw deny from 203.0.113.0/24, ufw enable, ufw status numbered.
• Raw nftables: nft list ruleset; tables contain chains with hooks (input, forward, output) and rules. Save to /etc/nftables.conf for persistence.

NAT AND PORT FORWARDING: To route between networks, first enable forwarding in the kernel with sysctl (net.ipv4.ip_forward = 1 in /etc/sysctl.d/). NAT masquerading lets internal hosts share the gateway's address. Configuring port forwarding (DNAT) sends traffic for one port to another port or host: firewall-cmd --add-forward-port=port=8080:proto=tcp:toport=80:toaddr=10.0.0.50.

STATIC ROUTING, BONDS AND BRIDGES: Static routes go in the connection profile (nmcli con mod ... +ipv4.routes). A network bond combines NICs for failover (active-backup) or throughput (802.3ad), created with nmcli con add type bond. A network bridge is a software switch that VMs and containers attach to (nmcli con add type bridge).

REVERSE PROXIES AND LOAD BALANCERS: A reverse proxy such as Nginx accepts client requests and forwards them to backends with proxy_pass. An upstream block lists several backends for round-robin load balancing. HAProxy does the same with frontend and backend sections plus health checks. On SELinux systems, a proxy connecting to backends needs the httpd_can_network_connect boolean.`,
       subtopics:["SSH client config, keys, agent and jump hosts","Hardening sshd_config and testing with sshd -t","firewalld zones, --permanent and --reload; UFW","nftables tables, chains and rules","IP forwarding, masquerade and port forwarding","Bonds, bridges, and Nginx/HAProxy load balancing"],
       commands:[
         {cmd:"ssh -J bastion admin@10.0.0.20",desc:"Connect through a jump host."},
         {cmd:"sshd -t && systemctl reload sshd",desc:"Validate, then apply SSH server changes."},
         {cmd:"firewall-cmd --permanent --zone=public --add-port=8443/tcp && firewall-cmd --reload",desc:"Open a port permanently."},
         {cmd:"firewall-cmd --list-all",desc:"Everything allowed in the default zone."},
         {cmd:"nmcli con add type bond ifname bond0 bond.options 'mode=active-backup'",desc:"Create an active-backup bond."},
         {cmd:"printf 'upstream app { server 10.0.0.11:8080; server 10.0.0.12:8080; }' > /etc/nginx/conf.d/upstream.conf",desc:"Nginx upstream for load balancing."},
       ],
       resources:[
         {title:"OpenSSH manual pages",url:"https://www.openssh.com/manual.html"},
         {title:"firewalld documentation",url:"https://firewalld.org/documentation/"},
         {title:"nftables wiki",url:"https://wiki.nftables.org/"},
         {title:"Nginx — Using nginx as an HTTP load balancer",url:"https://nginx.org/en/docs/http/load_balancing.html"},
       ]},
      {title:"SELinux & Access Hardening",
       keywords:["SELinux","SELinux context","SELinux boolean","PAM","ulimit","root user"],
       explanation:`Standard permissions are discretionary: an owner can give access away, and the root user bypasses them. SELinux adds mandatory access control. The policy decides what each process may touch, regardless of ownership. LFCS expects you to fix SELinux problems properly, not switch it off.

MODES: getenforce and sestatus show the mode. Enforcing blocks and logs violations; Permissive logs only (good for diagnosis); Disabled turns it off. setenforce 0/1 switches between enforcing and permissive at runtime. The persistent setting is SELINUX= in /etc/selinux/config. Moving from disabled to enforcing requires a full relabel (touch /.autorelabel and reboot).

LABELS: Every file, process and port has an SELinux context: user:role:type:level. The type matters most. A web server process runs as httpd_t and may read files labelled httpd_sys_content_t. ls -Z, ps -Z and id -Z show labels.

FIXING FILE LABELS: Files usually get the wrong label when they are created somewhere unusual or moved with mv (which keeps the original label; cp creates a new label).
• restorecon -Rv /path → reset files to what the policy says they should be
• semanage fcontext -a -t httpd_sys_content_t '/srv/web(/.*)?' then restorecon → teach the policy a new location permanently
• chcon -t ... → temporary change, undone by the next relabel. Avoid it for permanent fixes.

BOOLEANS: An SELinux boolean switches optional rules on or off: httpd_can_network_connect, httpd_enable_homedirs, samba_export_all_rw and many more. getsebool -a lists them; setsebool -P name on sets one persistently (without -P it resets at reboot). semanage boolean -l shows descriptions.

PORTS: Services may only bind to ports with the right type. semanage port -l | grep http shows allowed web ports; semanage port -a -t http_port_t -p tcp 8081 adds one.

FINDING DENIALS: Denials are logged as AVC messages in /var/log/audit/audit.log. ausearch -m AVC -ts recent finds them; sealert -a /var/log/audit/audit.log (from setroubleshoot) explains them and usually suggests the exact fix. audit2allow can build a custom module, but it is a last resort; a label or boolean is almost always the right answer.

OTHER HARDENING: AppArmor is the path-based alternative on Ubuntu (aa-status). User resource limits come from PAM's pam_limits module: /etc/security/limits.conf and limits.d/*.conf set ulimit values such as nofile and nproc per user or group, with soft limits users can raise up to the hard limit. Services take limits from their unit file instead (LimitNOFILE=). Keep packages patched, remove unused services, and log in with keys.`,
       subtopics:["Enforcing, permissive and disabled; /etc/selinux/config","Contexts on files, processes and ports","restorecon vs semanage fcontext vs chcon","Booleans with getsebool and setsebool -P","Reading AVC denials: ausearch and sealert","User resource limits with limits.conf and AppArmor basics"],
       commands:[
         {cmd:"sestatus",desc:"Mode, policy and whether a reboot is pending."},
         {cmd:"ls -Z /var/www/html; ps -eZ | grep httpd",desc:"File and process labels."},
         {cmd:"semanage fcontext -a -t httpd_sys_content_t '/web(/.*)?' && restorecon -Rv /web",desc:"Persistently label a custom web root."},
         {cmd:"setsebool -P httpd_enable_homedirs on",desc:"Persistently enable a boolean."},
         {cmd:"sealert -a /var/log/audit/audit.log",desc:"Human-readable explanations of denials."},
         {cmd:"echo '@developers soft nofile 4096' >> /etc/security/limits.d/dev.conf",desc:"Open-files limit for a group."},
       ],
       resources:[
         {title:"Red Hat — Using SELinux",url:"https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_selinux/index"},
         {title:"SELinux Project Wiki",url:"https://selinuxproject.org/page/Main_Page"},
       ]},
      {title:"Performance, Kernel Tuning & Recovery",
       keywords:["load average","sysctl","iostat","OOM killer","GRUB","initramfs","fstab","journalctl"],
       explanation:`When something is slow or broken, a calm method beats guessing. This topic covers monitoring, kernel parameters and getting a broken system booting again.

THE USE METHOD: For each resource (CPU, memory, disk, network) check Utilisation, Saturation and Errors.
• CPU → uptime and the load average compared with nproc; top; mpstat -P ALL. High %wa (iowait) means CPUs are waiting on disk.
• Memory → free -h (look at available, not free); vmstat 1 (si/so columns show swapping); dmesg for OOM killer events.
• Disk → iostat -xz 1 (%util near 100 and high await mean a saturated disk); iotop shows which process is doing I/O; df -h and df -i show space and inodes.
• Network → ss -s, ip -s link (errors and drops), sar -n DEV.
sar (from the sysstat package) keeps history so you can see what happened at 03:00.

DISK SPACE PROBLEMS: Find the full filesystem with df -h, then drill down with du -xh --max-depth=1 | sort -h. If df shows full but du cannot find the files, a deleted file is still held open: lsof +L1 finds it, and restarting the process releases the space. If df -i shows 100%, you have run out of inodes (millions of small files) even though space remains. Cap the journal with journalctl --vacuum-size and SystemMaxUse=.

KERNEL PARAMETERS: sysctl reads and writes tunables under /proc/sys. sysctl -a lists them; sysctl -w vm.swappiness=10 changes one now. For persistence, put name = value lines in /etc/sysctl.d/99-custom.conf and run sysctl --system. Common ones: net.ipv4.ip_forward, vm.swappiness, fs.file-max, net.core.somaxconn. Kernel modules are managed with lsmod, modprobe, and options in /etc/modprobe.d/.

APPLICATION CONSTRAINTS: When a service fails, check its limits as well as its logs: open files (ulimit -n, LimitNOFILE in the unit), ports already in use (ss -tlnp), SELinux denials, missing directories or permissions, and memory limits (MemoryMax= in a unit).

THE BOOT PROCESS: Firmware (UEFI/BIOS) → GRUB → kernel plus initramfs → systemd → default target. At the GRUB menu press e to edit the kernel line for one boot:
• systemd.unit=rescue.target → single-user maintenance with most services stopped
• systemd.unit=emergency.target → minimal shell with root mounted read-only
• rd.break → stop inside the initramfs, used to reset a lost root password (mount -o remount,rw /sysroot; chroot /sysroot; passwd; touch /.autorelabel)
Persistent kernel arguments go in /etc/default/grub (then regenerate with grub2-mkconfig or update-grub) or via grubby.

FILESYSTEM RECOVERY: A bad fstab entry is the most common cause of emergency mode. Remount root read-write, fix the line (or add nofail), run mount -a, and continue. Repair corruption with fsck or e2fsck (ext4) and xfs_repair (XFS) on unmounted filesystems only. Regenerate a broken initramfs with dracut -f or update-initramfs -u.`,
       subtopics:["USE method: utilisation, saturation, errors","top, vmstat, iostat, sar and free","Disk space: du, lsof +L1, inode exhaustion","sysctl runtime vs /etc/sysctl.d persistence; kernel modules","Boot sequence and GRUB kernel arguments","Rescue/emergency targets, rd.break, fsck and xfs_repair"],
       commands:[
         {cmd:"vmstat 1 5",desc:"CPU, memory, swap-in/out and I/O wait per second."},
         {cmd:"iostat -xz 1 3",desc:"Per-device utilisation and latency."},
         {cmd:"sar -u -f /var/log/sa/sa$(date +%d)",desc:"Today's CPU history (RHEL path)."},
         {cmd:"echo 'vm.swappiness = 10' > /etc/sysctl.d/99-swap.conf && sysctl --system",desc:"Persistent kernel parameter."},
         {cmd:"lsof +L1",desc:"Deleted files still using disk space."},
         {cmd:"grubby --update-kernel=ALL --args='console=ttyS0'",desc:"Add a persistent kernel argument (RHEL)."},
       ],
       resources:[
         {title:"Brendan Gregg — The USE Method",url:"https://www.brendangregg.com/usemethod.html"},
         {title:"Linux kernel sysctl documentation",url:"https://docs.kernel.org/admin-guide/sysctl/index.html"},
         {title:"systemd bootup man page",url:"https://www.freedesktop.org/software/systemd/man/latest/bootup.html"},
       ]},
      {title:"Containers & Virtual Machines",
       keywords:["container","Podman","Docker","KVM","libvirt","virsh","SELinux","systemd","network bridge"],
       explanation:`LFCS includes running containers and managing virtual machines. Both isolate workloads, but in different ways.

CONTAINERS VS VMs: A container is an isolated process tree that shares the host kernel, using namespaces (what it can see) and cgroups (how much it can use). It starts in milliseconds and is small. A VM runs a whole guest operating system on virtual hardware: heavier, but fully isolated and able to run a different kernel.

CONTAINER ENGINES: Podman and Docker use almost identical commands. Podman is daemonless and can run rootless (as a normal user). Docker uses the dockerd daemon.
• Images: podman pull nginx, podman images, podman rmi. Prefer fully qualified names such as docker.io/library/nginx:1.27.
• Run: podman run -d --name web -p 8080:80 -e TZ=UTC -v /srv/site:/usr/share/nginx/html:Z nginx
  -d detach · -p host:container port · -e environment · -v host:container volume · --restart=always
• Manage: podman ps -a, logs, exec -it web sh, stop, start, rm, inspect.
• Build: a Containerfile or Dockerfile (FROM, RUN, COPY, EXPOSE, CMD) built with podman build -t myapp:1.0 .
Data written inside a container is lost when it is removed, so keep anything important in volumes. On SELinux hosts, the :Z suffix relabels a host directory for the container.

CONTAINERS AS SERVICES: To start a container at boot, let systemd manage it. With Podman 4.4+, Quadlet files (/etc/containers/systemd/*.container) generate services after systemctl daemon-reload. Older systems use podman generate systemd --new --files. Docker uses --restart=unless-stopped with the docker service enabled.

VIRTUAL MACHINES WITH KVM: KVM turns the kernel into a hypervisor (check CPU support with grep -E 'vmx|svm' /proc/cpuinfo). libvirt manages VMs, storage pools and networks; virsh is its CLI and virt-install creates guests.
• virsh list --all · start · shutdown (graceful) · destroy (power off) · reboot
• virsh autostart vm1 → start at host boot; virsh dominfo, dumpxml and edit
• virsh setmem/setvcpus (with --config for persistence) adjust resources
• Storage: virsh pool-list, vol-list, vol-create-as; disks are often qcow2 images under /var/lib/libvirt/images
• Networking: the default NAT network (virbr0) or a network bridge on the host for direct LAN access
virt-install --name vm1 --memory 2048 --vcpus 2 --disk size=10 --cdrom image.iso --os-variant generic creates a VM from the command line; --import boots an existing disk image.`,
       subtopics:["Containers vs VMs: namespaces, cgroups, hypervisors","Podman/Docker: pull, run, ps, logs, exec, rm","Ports, environment variables and volumes (:Z on SELinux)","Building images from a Containerfile","Starting containers at boot with Quadlet/systemd","KVM and libvirt: virsh lifecycle, autostart, pools, virt-install"],
       commands:[
         {cmd:"podman run -d --name db -e MARIADB_ROOT_PASSWORD=secret -v dbdata:/var/lib/mysql docker.io/library/mariadb:11",desc:"Database container with a named volume."},
         {cmd:"podman build -t myapp:1.0 . && podman images",desc:"Build an image from a Containerfile."},
         {cmd:"podman inspect web --format '{{.NetworkSettings.IPAddress}}'",desc:"Extract one field from container metadata."},
         {cmd:"virsh list --all && virsh dominfo vm1",desc:"List VMs and show details for one."},
         {cmd:"virsh setmem vm1 2G --config",desc:"Change a VM's memory for the next boot."},
         {cmd:"virt-install --name vm2 --memory 1024 --vcpus 1 --import --disk /var/lib/libvirt/images/base.qcow2 --os-variant generic --noautoconsole",desc:"Create a VM from an existing image."},
       ],
       resources:[
         {title:"Podman documentation",url:"https://docs.podman.io/en/latest/"},
         {title:"Podman Quadlet (podman-systemd.unit)",url:"https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html"},
         {title:"libvirt — virsh command reference",url:"https://www.libvirt.org/manpages/virsh.html"},
       ]},
      {title:"Automation: Bash Scripting, Git & TLS",
       keywords:["Bash","shebang","exit code","Git","TLS","OpenSSL","X.509 certificate"],
       explanation:`Good admins automate repetitive work, track configuration changes and keep certificates healthy. The Essential Commands domain covers Git and SSL certificates explicitly.

BASH SCRIPTING: Every Bash script starts with a shebang (#!/bin/bash) and make the file executable (chmod +x). set -euo pipefail stops on errors, undefined variables and failed pipeline stages.
• Variables: name=value (no spaces), use "$name" in double quotes. $1, $2 are arguments, $# the count, "$@" all of them, $? the last exit code.
• Tests: if [[ -f /etc/app.conf ]]; then ... fi. -f file, -d directory, -z empty string, -eq/-lt for numbers, == for strings.
• Loops: for host in web01 web02; do ssh "$host" uptime; done and while read -r line; do ...; done < file.
• Command substitution: today=$(date +%F). Functions: backup() { tar -czf "$1.tgz" "$1"; }.
Every script returns an exit code; exit 1 signals failure to cron, systemd or the calling script.

GIT BASICS: Git tracks changes to files, ideal for /etc configs, scripts and infrastructure code.
• git init or git clone <url> → start or copy a repository
• git status → what changed; git diff → the exact changes
• git add <file> then git commit -m "message" → record a snapshot
• git log --oneline → history; git show <commit> → one change
• git branch, git switch -c feature, git merge feature → branches
• git remote -v, git pull, git push → sync with a server
Set your identity first: git config --global user.name and user.email. git restore file discards uncommitted changes; git revert <commit> safely undoes a published commit.

TLS AND CERTIFICATES: TLS encrypts traffic and proves a server's identity using an X.509 certificate signed by a certificate authority (CA). A certificate contains a subject, subject alternative names (SANs), an issuer, a validity period and a public key; the matching private key must stay secret (mode 600).
OpenSSL is the toolkit:
• openssl genrsa -out key.pem 2048 → private key
• openssl req -new -key key.pem -out req.csr -subj "/CN=web01.example.com" → certificate signing request to send to a CA
• openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 365 -subj "/CN=web01" → self-signed certificate for labs
• openssl x509 -in cert.pem -noout -text | -dates | -subject → inspect a certificate
• openssl s_client -connect host:443 -servername host → test a live server and view its chain
• openssl verify -CAfile ca.pem cert.pem → check a chain
Add trusted CAs system-wide with update-ca-trust (RHEL, files in /etc/pki/ca-trust/source/anchors) or update-ca-certificates (Debian, /usr/local/share/ca-certificates). Expired certificates are a very common cause of outages, so check dates regularly.`,
       subtopics:["Shebang, set -euo pipefail, variables and arguments","Tests, loops, functions and exit codes","Git: clone, status, add, commit, log, branch, push/pull","Undoing changes: restore and revert","Keys, CSRs and self-signed certificates with OpenSSL","Inspecting certificates and adding trusted CAs"],
       commands:[
         {cmd:"bash -n script.sh && shellcheck script.sh",desc:"Syntax-check and lint a script."},
         {cmd:"for h in web0{1..3}; do ssh $h 'df -h /' ; done",desc:"Run a command on several hosts."},
         {cmd:"git init /etc/myapp && cd /etc/myapp && git add -A && git commit -m 'baseline'",desc:"Put a config directory under version control."},
         {cmd:"git log --oneline --graph -10",desc:"Recent history as a graph."},
         {cmd:"openssl x509 -in /etc/pki/tls/certs/web.crt -noout -enddate",desc:"When does a certificate expire?"},
         {cmd:"openssl s_client -connect example.com:443 -servername example.com </dev/null | openssl x509 -noout -subject -dates",desc:"Check a remote server's certificate."},
       ],
       resources:[
         {title:"Pro Git book (free)",url:"https://git-scm.com/book/en/v2"},
         {title:"OpenSSL command documentation",url:"https://docs.openssl.org/master/man1/"},
         {title:"ShellCheck — script analysis",url:"https://www.shellcheck.net/"},
       ]},
    ],
    labs:[
      {title:"Lab 11: SSH Hardening",difficulty:"Hard",desc:"Configure key-only SSH for user admin, disable root login and password authentication, and move SSH to port 2222. Update SELinux and the firewall, verify a new login works on 2222, then remove the port 22 rule.",solution:"ssh-keygen -t ed25519 && ssh-copy-id admin@server\nprintf 'Port 2222\\nPermitRootLogin no\\nPasswordAuthentication no\\n' > /etc/ssh/sshd_config.d/10-hardening.conf\nsshd -t\nsemanage port -a -t ssh_port_t -p tcp 2222\nfirewall-cmd --permanent --add-port=2222/tcp && firewall-cmd --reload\nsystemctl reload sshd\nssh -p 2222 admin@server true\nfirewall-cmd --permanent --remove-service=ssh && firewall-cmd --reload"},
      {title:"Lab 12: SELinux Detective",difficulty:"Hard",desc:"Serve a site from /web with Apache or Nginx while SELinux is enforcing. Diagnose the 403 using the audit log, fix the labels persistently, make the web server listen on port 8081 as well, and allow it to connect to a backend.",solution:"mkdir /web && echo ok > /web/index.html\nausearch -m AVC -ts recent\nsemanage fcontext -a -t httpd_sys_content_t '/web(/.*)?'\nrestorecon -Rv /web && ls -Zd /web\nsemanage port -a -t http_port_t -p tcp 8081\nsetsebool -P httpd_can_network_connect on\nsystemctl restart httpd && curl -s localhost:8081"},
      {title:"Lab 13: Gateway & Port Forward",difficulty:"Hard",desc:"Make a host route traffic between two networks: enable IPv4 forwarding persistently, masquerade the external interface, and forward external TCP 2222 to 10.0.0.20:22. Add a reverse proxy in Nginx that balances /app between two backends.",solution:"echo 'net.ipv4.ip_forward = 1' > /etc/sysctl.d/90-fwd.conf && sysctl --system\nfirewall-cmd --permanent --zone=external --change-interface=eth0\nfirewall-cmd --permanent --zone=external --add-masquerade\nfirewall-cmd --permanent --zone=external --add-forward-port=port=2222:proto=tcp:toport=22:toaddr=10.0.0.20\nfirewall-cmd --reload && firewall-cmd --zone=external --list-all\n# /etc/nginx/conf.d/app.conf\n# upstream app { server 10.0.0.11:8080; server 10.0.0.12:8080; }\n# server { listen 80; location /app/ { proxy_pass http://app/; } }\nnginx -t && systemctl reload nginx"},
      {title:"Lab 14: Containers & VMs",difficulty:"Hard",desc:"Run a MariaDB container with a named volume and an Nginx container serving /srv/site on port 8080. Make the Nginx container start at boot through systemd. Then list all libvirt VMs, set one to autostart, and give it 2 GiB RAM from its next boot.",solution:"podman volume create dbdata\npodman run -d --name db -e MARIADB_ROOT_PASSWORD=secret -v dbdata:/var/lib/mysql docker.io/library/mariadb:11\nprintf '[Container]\\nImage=docker.io/library/nginx\\nPublishPort=8080:80\\nVolume=/srv/site:/usr/share/nginx/html:Z\\n[Install]\\nWantedBy=multi-user.target\\n' > /etc/containers/systemd/site.container\nsystemctl daemon-reload && systemctl start site\nvirsh list --all\nvirsh autostart vm1\nvirsh setmaxmem vm1 2G --config && virsh setmem vm1 2G --config"},
      {title:"Lab 15: Automate, Track & Secure",difficulty:"Hard",desc:"Write a script that reports filesystems above 80% use and exits 1 if any are found. Put it in a Git repository with two commits. Create a self-signed certificate for web01.lab.local valid for 30 days, inspect its dates, and set a sysctl so the kernel prefers RAM over swap persistently.",solution:"cat > /usr/local/bin/diskcheck.sh <<'EOF'\n#!/bin/bash\nset -euo pipefail\nfull=$(df -h --output=pcent,target | awk 'NR>1 && int($1)>80')\n[[ -z \"$full\" ]] && exit 0 || { echo \"$full\"; exit 1; }\nEOF\nchmod +x /usr/local/bin/diskcheck.sh\ncd /usr/local/bin && git init && git add diskcheck.sh && git commit -m 'Add disk check'\nopenssl req -x509 -newkey rsa:2048 -nodes -keyout web01.key -out web01.crt -days 30 -subj '/CN=web01.lab.local'\nopenssl x509 -in web01.crt -noout -dates -subject\necho 'vm.swappiness = 10' > /etc/sysctl.d/99-swap.conf && sysctl --system"},
    ],
    assessment:{title:"L3 Production Grade Quiz",questions:[
      {q:"What should you always run before reloading sshd after editing its configuration?",options:["ssh-keygen -A","sshd -t","systemctl daemon-reload","ssh -v localhost"],answer:1,explain:"sshd -t validates the configuration. If it has errors, a reload could leave you without SSH access."},
      {q:"SSH ignores a user's authorized_keys file. What is a likely cause?",options:["The key is ed25519","~/.ssh or authorized_keys is writable by group or others","PermitRootLogin is set to no","The server uses port 22"],answer:1,explain:"With StrictModes (the default) sshd rejects keys when ~/.ssh or authorized_keys has loose permissions. Use 700 and 600."},
      {q:"You ran 'firewall-cmd --add-service=https --permanent' but HTTPS is still blocked. What is missing?",options:["firewall-cmd --reload","systemctl restart sshd","--zone=trusted","nft flush ruleset"],answer:0,explain:"--permanent writes the rule to disk but does not change the running firewall. --reload activates it."},
      {q:"What must be enabled for Linux to route packets between interfaces?",options:["net.ipv4.ip_forward = 1","vm.swappiness = 0","SELinux permissive","A network bond"],answer:0,explain:"Forwarding is off by default. Set net.ipv4.ip_forward = 1 in /etc/sysctl.d/ and run sysctl --system."},
      {q:"Which bond mode provides failover with only one active interface?",options:["802.3ad","balance-rr","active-backup","broadcast"],answer:2,explain:"active-backup keeps one link active and switches to another on failure. 802.3ad (LACP) aggregates links and needs switch support."},
      {q:"Nginx returns 403 for files in /srv/web, permissions look fine, and SELinux is enforcing. What is the proper fix?",options:["setenforce 0","chmod 777 /srv/web","semanage fcontext -a -t httpd_sys_content_t '/srv/web(/.*)?' then restorecon -Rv /srv/web","chcon -R -t httpd_sys_content_t /srv/web only"],answer:2,explain:"semanage fcontext records the rule in policy and restorecon applies it, so it survives relabels. chcon is temporary and setenforce 0 removes protection."},
      {q:"What does the -P flag do in 'setsebool -P httpd_can_network_connect on'?",options:["Prints the boolean","Makes the change persistent across reboots","Applies to all processes","Enables permissive mode"],answer:1,explain:"Without -P the boolean reverts at reboot. -P writes it to the policy store."},
      {q:"Where are SELinux AVC denials logged on a typical RHEL system?",options:["/var/log/messages only","/var/log/audit/audit.log","/etc/selinux/log","~/.selinux"],answer:1,explain:"auditd writes AVC records to /var/log/audit/audit.log. ausearch -m AVC and sealert read them."},
      {q:"df shows / is full, but du cannot account for the space. What should you check?",options:["Inode usage only","Deleted files still held open, with lsof +L1","The swap partition","The GRUB config"],answer:1,explain:"Space from a deleted file is freed only when the last process closes it. lsof +L1 lists such files; restarting the process frees the space."},
      {q:"How do you make a kernel parameter change permanent?",options:["sysctl -w name=value","Add name = value to a file in /etc/sysctl.d/ and run sysctl --system","Edit /proc/sys directly","Add it to /etc/fstab"],answer:1,explain:"sysctl -w and writes to /proc/sys are runtime only. Files in /etc/sysctl.d/ are applied at every boot."},
      {q:"Which kernel argument boots to a minimal shell with the root filesystem read-only?",options:["systemd.unit=emergency.target","systemd.unit=graphical.target","quiet splash","init=/bin/true"],answer:0,explain:"emergency.target starts almost nothing and leaves root read-only. rescue.target starts a little more and mounts local filesystems."},
      {q:"What does the :Z suffix in 'podman run -v /srv/site:/usr/share/nginx/html:Z' do?",options:["Compresses the volume","Relabels the host directory so the container may access it under SELinux","Makes the volume read-only","Zeroes the directory"],answer:1,explain:":Z relabels the content with a private container label. :z uses a shared label for directories used by several containers."},
      {q:"What is the difference between virsh shutdown and virsh destroy?",options:["None","shutdown asks the guest OS to power off; destroy cuts power immediately","destroy deletes the VM permanently","shutdown deletes the disk"],answer:1,explain:"destroy is an immediate power-off and does not delete anything. virsh undefine removes the VM definition."},
      {q:"Which Git command records staged changes in the repository history?",options:["git add","git commit -m 'msg'","git push","git status"],answer:1,explain:"git add stages changes; git commit records them as a snapshot. git push sends commits to a remote."},
      {q:"Which command shows when a certificate file expires?",options:["openssl genrsa -in cert.pem","openssl x509 -in cert.pem -noout -enddate","openssl req -new -in cert.pem","update-ca-trust --dates"],answer:1,explain:"openssl x509 -noout -enddate prints the notAfter date. -dates shows both start and end, and -text shows everything."},
    ]}
  },
];

const EXAM_LINKS = [
  {cat:"Official & Exam",links:[
    {title:"LFCS Certification — Linux Foundation",url:"https://training.linuxfoundation.org/certification/linux-foundation-certified-sysadmin-lfcs/"},
    {title:"LFCS Domains & Competencies",url:"https://training.linuxfoundation.org/certification/linux-foundation-certified-sysadmin-lfcs/#domains"},
    {title:"killer.sh — LFCS Simulator",url:"https://killer.sh/lfcs"},
    {title:"LF Candidate Handbook",url:"https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2"},
  ]},
  {cat:"Hands-on Practice",links:[
    {title:"Killercoda Linux Playgrounds",url:"https://killercoda.com/playgrounds"},
    {title:"KodeKloud LFCS Course",url:"https://kodekloud.com/courses/linux-foundation-certified-system-administrator-lfcs"},
    {title:"OverTheWire Bandit (shell skills)",url:"https://overthewire.org/wargames/bandit/"},
    {title:"VirtualBox — local practice VMs",url:"https://www.virtualbox.org/"},
  ]},
  {cat:"Distribution Docs",links:[
    {title:"Red Hat Enterprise Linux 9 Docs",url:"https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9"},
    {title:"Ubuntu Server Guide",url:"https://documentation.ubuntu.com/server/"},
    {title:"Arch Wiki (great for any distro)",url:"https://wiki.archlinux.org/"},
    {title:"The Linux Command Line (free book)",url:"https://linuxcommand.org/tlcl.php"},
  ]},
  {cat:"Reference",links:[
    {title:"man7.org — Linux man pages",url:"https://man7.org/linux/man-pages/"},
    {title:"explainshell — break down a command",url:"https://explainshell.com/"},
  ]},
];

// ─── MOCK EXAM: CONFIG ───────────────────────────────────────────────────────
// Five domains of the current LFCS curriculum, with their official weights.
const PASS_MARK = 67;
const DOMAINS = {
  1:{ name:"Operations Deployment", short:"Operations Deployment", weight:"25%", color:T.cyan, rgb:"34,211,238", icon:"⚙" },
  2:{ name:"Networking", short:"Networking", weight:"25%", color:T.violet, rgb:"167,139,250", icon:"⇄" },
  3:{ name:"Storage", short:"Storage", weight:"20%", color:T.amber, rgb:"251,191,36", icon:"▤" },
  4:{ name:"Essential Commands", short:"Essential Commands", weight:"20%", color:T.green, rgb:"52,211,153", icon:"$_" },
  5:{ name:"Users and Groups", short:"Users and Groups", weight:"10%", color:T.pink, rgb:"244,114,182", icon:"👥" },
};
const DOMAIN_IDS = [1, 2, 3, 4, 5];
const EXAM_MODES = {
  full:{ label:"Full Mock Exam", icon:"🎯", counts:{1:13,2:12,3:10,4:10,5:5}, minutes:75, color:T.green, rgb:"52,211,153",
    desc:"50 questions mixed across all five domains using the official LFCS weighting. The closest thing to the real test in question form." },
  quick:{ label:"Quick Check", icon:"⚡", counts:{1:5,2:5,3:4,4:4,5:2}, minutes:30, color:T.pink, rgb:"244,114,182",
    desc:"20 weighted questions for a fast snapshot of where you stand today." },
  d1:{ label:"Domain 1 Drill", icon:DOMAINS[1].icon, counts:{1:10}, minutes:15, color:DOMAINS[1].color, rgb:DOMAINS[1].rgb,
    desc:"10 questions on systemd, processes, logs, scheduling, packages, kernel parameters, SELinux, containers, VMs and recovery." },
  d2:{ label:"Domain 2 Drill", icon:DOMAINS[2].icon, counts:{2:10}, minutes:15, color:DOMAINS[2].color, rgb:DOMAINS[2].rgb,
    desc:"10 questions on IPv4/IPv6, DNS, time sync, SSH, firewalls, NAT, routing, bonds, bridges and reverse proxies." },
  d3:{ label:"Domain 3 Drill", icon:DOMAINS[3].icon, counts:{3:10}, minutes:15, color:DOMAINS[3].color, rgb:DOMAINS[3].rgb,
    desc:"10 questions on partitions, filesystems, fstab, LVM, swap, NFS, autofs and storage performance." },
  d4:{ label:"Domain 4 Drill", icon:DOMAINS[4].icon, counts:{4:10}, minutes:15, color:DOMAINS[4].color, rgb:DOMAINS[4].rgb,
    desc:"10 questions on text tools, Git, services, performance, application constraints, disk space and SSL certificates." },
  d5:{ label:"Domain 5 Drill", icon:DOMAINS[5].icon, counts:{5:10}, minutes:15, color:DOMAINS[5].color, rgb:DOMAINS[5].rgb,
    desc:"10 questions on users, groups, environment profiles, resource limits, ACLs and LDAP accounts." },
  weak:{ label:"Weak-Area Practice", icon:"🩺", counts:{}, minutes:null, color:T.red, rgb:"248,113,113",
    desc:"Targeted questions on the lessons you scored below the pass mark on in your last attempt." },
};
const HISTORY_KEY = "lfcs-mock-history";

const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const band = p => p >= 80
  ? { label:"Strong", color:T.green, rgb:"52,211,153" }
  : p >= PASS_MARK
    ? { label:"Almost there", color:T.amber, rgb:"251,191,36" }
    : { label:"Weak", color:T.red, rgb:"248,113,113" };
const readiness = p => p >= 80
  ? { label:"Exam ready", emoji:"🏆", color:T.green, rgb:"52,211,153",
      msg:"You are scoring comfortably above the 67% pass line. Keep your edge with timed hands-on practice (the killer.sh simulator is included with your exam), then book it." }
  : p >= PASS_MARK
    ? { label:"Almost ready", emoji:"📖", color:T.amber, rgb:"251,191,36",
        msg:"You are just over the pass line. Fix the weak areas below and retake a full mock to build a safety margin." }
    : p >= 50
      ? { label:"Needs focused study", emoji:"🎯", color:T.amber, rgb:"251,191,36",
          msg:"You know the basics but there are clear gaps. Revisit the lessons and labs for your weak areas first, then practise them." }
      : { label:"Early stage", emoji:"🌱", color:T.red, rgb:"248,113,113",
          msg:"Plenty of room to grow. Work through the topics, labs and scenarios in order, then come back to the mock exam." };

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const a = raw ? JSON.parse(raw) : [];
    return Array.isArray(a) ? a : [];
  } catch (e) { return []; }
}

// ─── MOCK EXAM: QUESTION BANK ────────────────────────────────────────────────
// Q(domain, phaseIndex, topicIndex, question, correctAnswer, [3 wrong answers], explanation)
// domain is 1-5 (LFCS curriculum). phaseIndex/topicIndex point at the lesson to revisit.
// Options are shuffled every attempt, so the order written here does not matter.
// These are original practice questions, not real exam questions.
const Q = (d, p, i, q, right, wrong, explain) => ({ d, p, i, q, right, wrong, explain });
const QUESTION_BANK = [
  // ── Domain 1: Operations Deployment ──
  Q(1,1,0,"You created /etc/systemd/system/report.service. Which commands make it start now and at every boot?",
    "systemctl daemon-reload, then systemctl enable --now report.service",
    ["systemctl start report.service only","systemctl reload report.service","chkconfig report on"],
    "daemon-reload makes systemd read the new unit file. enable --now creates the boot-time link and starts the service immediately."),
  Q(1,1,0,"Where should you place a change to a vendor-supplied unit so package updates do not overwrite it?",
    "In a drop-in under /etc/systemd/system/<unit>.d/, for example with systemctl edit",
    ["Directly in /usr/lib/systemd/system/<unit>","In /etc/init.d/<unit>","In /var/lib/systemd/<unit>"],
    "/usr/lib/systemd/system belongs to packages. Drop-ins in /etc/systemd/system/<unit>.d/ override only the settings you specify and survive updates."),
  Q(1,1,0,"A service must never start, not even as a dependency of another unit. Which command achieves this?",
    "systemctl mask <unit>",
    ["systemctl disable <unit>","systemctl stop <unit>","systemctl isolate <unit>"],
    "disable only removes boot-time links, so another unit can still pull it in. mask links the unit to /dev/null so nothing can start it."),
  Q(1,1,0,"Which journalctl command shows only error-level messages (and worse) for sshd since the current boot?",
    "journalctl -u sshd -b -p err",
    ["journalctl -k sshd --errors","journalctl -f sshd","journalctl --since boot sshd -e"],
    "-u selects the unit, -b limits to this boot and -p err filters to priority err and above."),
  Q(1,1,0,"After a reboot, journalctl -b -1 says no previous boot is available. What is the cause?",
    "The journal is stored only in memory; create /var/log/journal or set Storage=persistent",
    ["rsyslog is not installed","The kernel was upgraded","journalctl needs root to read old boots"],
    "Without /var/log/journal (or Storage=persistent in journald.conf) journald keeps logs in /run, which is cleared at reboot."),
  Q(1,1,0,"Which service unit Type suits a script that runs to completion and exits?",
    "Type=oneshot",
    ["Type=simple","Type=forking","Type=notify"],
    "oneshot tells systemd the process is expected to exit, and the unit counts as successful when it exits with code 0."),
  Q(1,1,0,"How do you make the server boot to a text console instead of a graphical desktop?",
    "systemctl set-default multi-user.target",
    ["systemctl isolate rescue.target","systemctl disable graphical","Edit /etc/inittab and set runlevel 3"],
    "set-default changes the default boot target persistently. isolate switches immediately but only for the current boot."),
  Q(1,0,4,"A process ignores SIGTERM. Which signal stops it immediately, without allowing cleanup?",
    "SIGKILL (9)",
    ["SIGHUP (1)","SIGINT (2)","SIGCONT (18)"],
    "SIGKILL cannot be caught or ignored. Use it only after SIGTERM fails because the process gets no chance to flush data."),
  Q(1,0,4,"Which command lowers the priority of the running process with PID 4321 to the lowest level?",
    "renice -n 19 -p 4321",
    ["nice -n -20 4321","renice -n -20 -p 4321","kill -NICE 4321"],
    "19 is the lowest priority (nicest). -20 is the highest and only root can set negative values."),
  Q(1,0,4,"ps shows several processes in state Z. What are they and how are they cleared?",
    "Zombies that have exited; their parent must collect their status, so fix or restart the parent",
    ["Processes stuck on disk I/O; reboot the disk","Stopped jobs; resume them with fg","Kernel threads; they cannot be removed"],
    "A zombie has already exited and holds only a process-table slot. kill -9 has no effect on it. The parent process must reap it."),
  Q(1,1,1,"Which crontab entry runs /usr/local/bin/sync.sh at 22:15 every Monday to Friday?",
    "15 22 * * 1-5 /usr/local/bin/sync.sh",
    ["22 15 * * 1-5 /usr/local/bin/sync.sh","15 22 1-5 * * /usr/local/bin/sync.sh","* 22:15 * * mon-fri /usr/local/bin/sync.sh"],
    "The fields are minute, hour, day of month, month and day of week. 1-5 in the last field means Monday to Friday."),
  Q(1,1,1,"What is different about lines in /etc/cron.d/ files compared with a user's crontab?",
    "They include a user field between the schedule and the command",
    ["They use seconds as the first field","They run only once","They cannot use */ step values"],
    "System cron files (/etc/crontab and /etc/cron.d/*) specify which user runs the command. User crontabs always run as their owner."),
  Q(1,1,1,"In a systemd timer, which line runs the job every day at 04:00?",
    "OnCalendar=*-*-* 04:00:00",
    ["OnBootSec=4h","OnCalendar=4 * * *","Schedule=daily 04:00"],
    "OnCalendar uses systemd's calendar format: year-month-day hour:minute:second. systemd-analyze calendar verifies an expression."),
  Q(1,1,1,"Which command schedules a one-off job to run in two hours?",
    "echo '/root/task.sh' | at now + 2 hours",
    ["crontab -e +2h /root/task.sh","systemctl start --in=2h task","batch /root/task.sh 2h"],
    "at runs a command once at a given time. atq lists pending jobs and atrm cancels one."),
  Q(1,1,1,"On an Ubuntu system, apt install reports that a package cannot be found on a freshly built server. What should you try first?",
    "Run apt update to refresh the package lists",
    ["Run apt upgrade","Reboot the server","Install it with rpm -i"],
    "Fresh systems or new repositories have stale or empty package lists until apt update downloads them."),
  Q(1,1,1,"Which command identifies the RPM package that installed /etc/ssh/sshd_config?",
    "rpm -qf /etc/ssh/sshd_config",
    ["rpm -ql sshd_config","dnf search sshd_config","rpm -qa sshd_config"],
    "rpm -qf queries by file. On Debian-family systems the equivalent is dpkg -S /etc/ssh/sshd_config."),
  Q(1,1,1,"You need to build software from a source tarball into the default local prefix. What is the classic sequence?",
    "./configure, make, then sudo make install",
    ["make install, ./configure, make","rpm -bb, then dnf install","tar -x, then ./install.sh only"],
    "configure checks dependencies and writes Makefiles, make compiles, and make install copies files, usually under /usr/local."),
  Q(1,2,2,"How do you make net.ipv4.ip_forward=1 survive a reboot?",
    "Put net.ipv4.ip_forward = 1 in a file under /etc/sysctl.d/ and run sysctl --system",
    ["Run sysctl -w net.ipv4.ip_forward=1","echo 1 > /proc/sys/net/ipv4/ip_forward","Add it to /etc/fstab"],
    "sysctl -w and writing to /proc/sys only change the running kernel. Files in /etc/sysctl.d/ are applied at every boot."),
  Q(1,2,2,"Which command loads a kernel module along with its dependencies?",
    "modprobe <module>",
    ["insmod -r <module>","lsmod <module>","depmod <module>"],
    "modprobe resolves dependencies automatically. insmod loads a single file without dependencies; lsmod lists loaded modules."),
  Q(1,2,2,"The server drops into emergency mode after an /etc/fstab edit. What do you do first in the emergency shell?",
    "Remount / read-write with mount -o remount,rw /, then fix the fstab entry",
    ["Run xfs_repair on the root filesystem while mounted","Reinstall GRUB","Delete /etc/fstab"],
    "Root is often read-only in emergency mode. Make it writable, correct or comment out the bad line, test with mount -a, then continue booting."),
  Q(1,2,2,"Which GRUB kernel argument stops the boot inside the initramfs so you can reset a lost root password?",
    "rd.break",
    ["single","systemd.unit=graphical.target","nomodeset"],
    "rd.break drops to a shell before switching to the real root. Remount /sysroot read-write, chroot, run passwd, and touch /.autorelabel on SELinux systems."),
  Q(1,2,2,"Which command repairs an unmounted XFS filesystem on /dev/sdb1?",
    "xfs_repair /dev/sdb1",
    ["fsck.ext4 /dev/sdb1","xfs_growfs /dev/sdb1","e2fsck -f /dev/sdb1"],
    "XFS uses xfs_repair; e2fsck is for ext2/3/4. Repairs must never run on a mounted filesystem."),
  Q(1,2,1,"SELinux is enforcing and Nginx cannot read files in /srv/site. Which fix is persistent?",
    "semanage fcontext -a -t httpd_sys_content_t '/srv/site(/.*)?' followed by restorecon -Rv /srv/site",
    ["chcon -R -t httpd_sys_content_t /srv/site","setenforce 0","chmod -R 777 /srv/site"],
    "semanage fcontext records the rule in policy and restorecon applies it. chcon labels are lost on the next relabel."),
  Q(1,2,1,"Which command allows the web server to make outbound network connections permanently under SELinux?",
    "setsebool -P httpd_can_network_connect on",
    ["setsebool httpd_can_network_connect on","semanage port -a -t http_port_t","restorecon -P httpd"],
    "Booleans toggle optional policy rules. Without -P the change is lost at reboot."),
  Q(1,2,1,"Which file sets the SELinux mode used at boot?",
    "/etc/selinux/config",
    ["/etc/sysconfig/selinux.mode","/etc/default/grub only","/var/lib/selinux/mode"],
    "SELINUX=enforcing, permissive or disabled in /etc/selinux/config applies at boot. setenforce only changes the running mode."),
  Q(1,2,1,"A file was moved with mv from /root into /var/www/html and the web server cannot read it. Why?",
    "mv keeps the original SELinux context (admin_home_t); restorecon fixes it",
    ["mv strips all permissions","The file must be renamed .html","mv makes files immutable"],
    "cp creates a new file with the destination's default label, but mv keeps the old label. restorecon resets it to the policy default."),
  Q(1,2,3,"Which podman run options publish container port 80 on host port 8080 and run it in the background?",
    "-d -p 8080:80",
    ["-d -p 80:8080","-it --port 8080","--expose 8080 -b"],
    "-p takes host:container. -d detaches the container so it runs in the background."),
  Q(1,2,3,"Why does data written inside a container disappear after podman rm?",
    "The container's writable layer is deleted with it; persistent data belongs in a volume",
    ["Podman encrypts and discards it","Containers mount / read-only","Data is only lost on reboot"],
    "Each container has a thin writable layer that is removed with the container. Use -v for named volumes or bind mounts."),
  Q(1,2,3,"With Podman 4.4 or later, how do you make a container start automatically at boot under systemd?",
    "Write a Quadlet .container file in /etc/containers/systemd/ and run systemctl daemon-reload",
    ["podman run --boot","Add the container name to /etc/rc.local only","podman autostart <name>"],
    "Quadlet generates a systemd service from the .container file. Its [Install] section controls start at boot."),
  Q(1,2,3,"What is the difference between virsh shutdown vm1 and virsh destroy vm1?",
    "shutdown asks the guest OS to power off cleanly; destroy cuts power immediately",
    ["destroy deletes the VM and its disks","shutdown deletes the VM definition","They are identical"],
    "destroy is a hard power-off and deletes nothing. virsh undefine removes the VM definition."),
  Q(1,2,3,"Which command makes VM vm1 start automatically when the host boots?",
    "virsh autostart vm1",
    ["virsh start --boot vm1","systemctl enable vm1","virsh setboot vm1 on"],
    "virsh autostart marks the domain to start when libvirtd starts. --disable reverses it."),
  Q(1,2,3,"How do you check whether a CPU supports hardware virtualisation for KVM?",
    "grep -E 'vmx|svm' /proc/cpuinfo",
    ["lsmod | grep virtio","virsh capabilities --cpu-only","cat /sys/kvm/enabled"],
    "vmx is Intel VT-x and svm is AMD-V. Without one of them KVM cannot accelerate guests."),

  // ── Domain 2: Networking ──
  Q(2,1,4,"You add an address with ip addr add 10.0.0.5/24 dev eth0. What happens after a reboot?",
    "It is lost, because ip changes only the running configuration",
    ["It persists in /etc/network/interfaces","NetworkManager saves it automatically","It becomes a DHCP lease"],
    "Persistent settings must be made with nmcli, Netplan or systemd-networkd configuration files."),
  Q(2,1,4,"Which nmcli command sets a static IPv4 address and gateway on the profile eth0?",
    "nmcli con mod eth0 ipv4.method manual ipv4.addresses 10.0.0.5/24 ipv4.gateway 10.0.0.1",
    ["nmcli dev set eth0 ip 10.0.0.5 gw 10.0.0.1","nmcli con add eth0 static 10.0.0.5","ip con mod eth0 static 10.0.0.5/24"],
    "Connection properties are changed with nmcli con mod. Run nmcli con up eth0 afterwards to apply them."),
  Q(2,1,4,"How do you add the route 172.16.0.0/16 via 10.0.0.254 so it persists with NetworkManager?",
    "nmcli con mod eth0 +ipv4.routes '172.16.0.0/16 10.0.0.254' and then nmcli con up eth0",
    ["ip route add 172.16.0.0/16 via 10.0.0.254","route add -net 172.16.0.0/16 gw 10.0.0.254","echo the route >> /etc/hosts"],
    "The + appends to the route list in the profile. ip route add works only until reboot."),
  Q(2,1,4,"Which command shows which route and source address the kernel will use to reach 8.8.8.8?",
    "ip route get 8.8.8.8",
    ["ip route show 8.8.8.8 all","traceroute -n 8.8.8.8 --local","ss -r 8.8.8.8"],
    "ip route get performs a real routing lookup and prints the chosen gateway, interface and source address."),
  Q(2,1,4,"How many usable host addresses are in a /26 IPv4 subnet?",
    "62",
    ["64","30","126"],
    "/26 leaves 6 host bits: 2^6 = 64 addresses, minus the network and broadcast addresses = 62 usable."),
  Q(2,1,4,"Which file decides whether /etc/hosts is checked before DNS?",
    "/etc/nsswitch.conf",
    ["/etc/resolv.conf","/etc/host.conf only","/etc/sysconfig/network"],
    "The hosts: line in nsswitch.conf sets the lookup order, normally files then dns."),
  Q(2,1,4,"Which command resolves a hostname the same way applications do, honouring /etc/hosts?",
    "getent hosts <name>",
    ["dig <name>","nslookup <name>","host <name>"],
    "getent uses the NSS order from nsswitch.conf. dig, nslookup and host query DNS servers directly."),
  Q(2,1,4,"Which command sets the hostname persistently?",
    "hostnamectl set-hostname web01.example.com",
    ["hostname web01.example.com","echo web01 > /proc/sys/kernel/hostname","nmcli con mod hostname web01"],
    "hostnamectl updates /etc/hostname and the running hostname. The plain hostname command changes only the running value."),
  Q(2,1,4,"How do you enable automatic time synchronisation with systemd tools?",
    "timedatectl set-ntp true",
    ["ntpdate --enable","hwclock --systohc --ntp","date --ntp on"],
    "set-ntp true enables the configured time service (chronyd or systemd-timesyncd). timedatectl shows whether the clock is synchronised."),
  Q(2,1,4,"Which command lists the NTP sources chrony is using and how good they are?",
    "chronyc sources -v",
    ["chronyd --list","timedatectl show-sources","ntpq -s chrony"],
    "chronyc sources shows each server, its reachability and offset. A * marks the source currently used for synchronisation."),
  Q(2,1,4,"Which command lists listening TCP and UDP sockets with the owning process?",
    "ss -tulpn",
    ["netstat -r","ip -s link","lsof -i -r"],
    "-t TCP, -u UDP, -l listening, -p process, -n numeric. It is the quickest way to confirm a service is listening."),
  Q(2,1,4,"On Ubuntu, which command applies a Netplan change but rolls it back automatically if you lose access?",
    "netplan try",
    ["netplan apply --safe","netplan generate","systemctl restart netplan"],
    "netplan try applies the configuration and reverts after a timeout unless you confirm it, which protects remote sessions."),
  Q(2,2,0,"Which sshd_config settings block direct root login and password authentication?",
    "PermitRootLogin no and PasswordAuthentication no",
    ["RootLogin deny and AuthPassword off","AllowRoot no and UsePAM no","DenyUsers root and KbdInteractive yes"],
    "These are the two standard hardening directives. Test with sshd -t, then reload sshd."),
  Q(2,2,0,"SSH key login fails although the public key is in ~/.ssh/authorized_keys. Which permissions should you check?",
    "~/.ssh must be 700 and authorized_keys 600, both owned by the user",
    ["authorized_keys must be 777","The private key on the server must be 644","~/.ssh must be owned by root"],
    "With StrictModes enabled, sshd ignores keys stored in files or directories that others can write to."),
  Q(2,2,0,"You changed sshd to listen on port 2222 on an SELinux system and it fails to start. What is missing?",
    "semanage port -a -t ssh_port_t -p tcp 2222",
    ["setsebool -P ssh_custom_port on","restorecon /etc/ssh/sshd_config","chcon -t ssh_port_t /usr/sbin/sshd"],
    "SELinux only lets sshd bind to ports labelled ssh_port_t. Also open the port in the firewall."),
  Q(2,2,0,"Which ~/.ssh/config option makes ssh connect through a bastion host?",
    "ProxyJump bastion",
    ["Gateway bastion","ForwardHost bastion","Tunnel bastion"],
    "ProxyJump (the -J option on the command line) chains connections through one or more jump hosts."),
  Q(2,2,0,"You ran firewall-cmd --permanent --add-service=http but port 80 is still closed. Why?",
    "Permanent rules are not active until firewall-cmd --reload",
    ["The http service does not exist","firewalld needs a reboot","--permanent only works with --zone=trusted"],
    "--permanent writes the configuration to disk; --reload loads it into the running firewall."),
  Q(2,2,0,"Which firewalld command forwards TCP 8080 on this host to port 80 on 10.0.0.50?",
    "firewall-cmd --permanent --add-forward-port=port=8080:proto=tcp:toport=80:toaddr=10.0.0.50",
    ["firewall-cmd --permanent --add-port=8080:80/tcp","firewall-cmd --redirect 8080 10.0.0.50:80","firewall-cmd --permanent --add-service=8080-to-80"],
    "Forward-port rules perform DNAT. Forwarding to another host also needs masquerading and net.ipv4.ip_forward=1."),
  Q(2,2,0,"Internal hosts must reach the internet through this gateway using its public IP. Which firewalld feature does this?",
    "Masquerading on the external zone (--add-masquerade)",
    ["--add-rich-rule accept all","--set-target=ACCEPT on the internal zone","--add-port=0-65535/tcp"],
    "Masquerading is source NAT: outgoing packets take the gateway's address. Kernel forwarding must also be enabled."),
  Q(2,2,0,"On Ubuntu with UFW, which command allows SSH and then turns the firewall on?",
    "ufw allow 22/tcp && ufw enable",
    ["ufw enable && ufw open ssh","ufw start --allow ssh","iptables -A ufw ssh"],
    "Always allow SSH before enabling UFW on a remote server, or you will lock yourself out."),
  Q(2,2,0,"Which command shows the complete active nftables configuration?",
    "nft list ruleset",
    ["nft show all","iptables -S --nft","firewall-cmd --nft-dump"],
    "nft list ruleset prints every table, chain and rule, including those generated by firewalld."),
  Q(2,2,0,"Which network bond mode provides failover using one active interface at a time, with no switch configuration?",
    "active-backup",
    ["802.3ad","balance-xor","broadcast"],
    "active-backup (mode 1) needs no switch support. 802.3ad (LACP) aggregates links but requires a configured switch."),
  Q(2,2,0,"Virtual machines need addresses on the same LAN as the host. What should the host provide?",
    "A network bridge with the physical NIC attached",
    ["A network bond in 802.3ad mode","A NAT masquerade rule","A second default gateway"],
    "A bridge acts as a software switch, putting VM interfaces on the physical network. libvirt's default network uses NAT instead."),
  Q(2,2,0,"In Nginx, which directive sends requests for a location to backend servers?",
    "proxy_pass",
    ["backend_url","forward_to","upstream_send"],
    "proxy_pass http://app; forwards to an upstream group named app, which can list several servers for load balancing."),
  Q(2,2,0,"Nginx as a reverse proxy gets 502 errors on an SELinux system, and the audit log shows httpd_t denied name_connect. What fixes it?",
    "setsebool -P httpd_can_network_connect on",
    ["restorecon -Rv /etc/nginx","semanage port -d -t http_port_t 80","setenforce 0 in nginx.conf"],
    "By default SELinux stops web servers making outbound connections. This boolean allows proxying to backends."),
  Q(2,2,2,"Which tool captures packets on eth0 to confirm whether DNS queries are leaving the host?",
    "tcpdump -ni eth0 port 53",
    ["ss -ni eth0 port 53","ip monitor port 53","dig +trace eth0"],
    "tcpdump shows the traffic that actually crosses an interface, separating local configuration problems from network ones."),
  Q(2,1,4,"Which nmcli property sets the DNS servers for a connection?",
    "ipv4.dns",
    ["ipv4.resolvers","dns.servers","ipv4.nameserver-list"],
    "Use nmcli con mod eth0 ipv4.dns '10.0.0.2 1.1.1.1'. NetworkManager then manages resolv.conf or systemd-resolved."),
  Q(2,1,4,"Which command adds an IPv6 address to a NetworkManager profile?",
    "nmcli con mod eth0 ipv6.method manual ipv6.addresses 2001:db8::10/64",
    ["nmcli con mod eth0 ipv4.addresses 2001:db8::10/64","ip -6 addr add 2001:db8::10/64 --permanent","ifconfig eth0 inet6 add 2001:db8::10/64 persist"],
    "IPv6 settings live under the ipv6.* properties. ip -6 addr add has no --permanent option."),
  Q(2,2,2,"A host can ping its gateway and external IPs but not names. Where is the problem most likely?",
    "Name resolution: check the configured DNS servers with resolvectl status or /etc/resolv.conf",
    ["The default route","The NIC driver","The firewall's input chain for ICMP"],
    "Working IP connectivity rules out link and routing. A DNS server or resolver configuration issue remains."),

  // ── Domain 3: Storage ──
  Q(3,1,2,"Why should /etc/fstab refer to filesystems by UUID instead of /dev/sdb1?",
    "Device names can change between boots, but the filesystem UUID stays the same",
    ["UUIDs mount faster","fstab rejects /dev names","UUIDs enable encryption"],
    "Adding or reordering disks can change /dev/sdX names. blkid or lsblk -f shows the UUID."),
  Q(3,1,2,"After adding a line to /etc/fstab, how do you test it without rebooting?",
    "Run systemctl daemon-reload, findmnt --verify and mount -a",
    ["Reboot into rescue mode","Run fsck on /etc/fstab","Run swapon -a only"],
    "findmnt --verify checks syntax and devices; mount -a mounts everything listed. If both succeed, the boot will too."),
  Q(3,1,2,"Which fstab option stops a missing non-critical disk from dropping the boot into emergency mode?",
    "nofail",
    ["noauto,critical","_netdev","defaults"],
    "nofail lets boot continue if the device is absent. noauto skips mounting at boot altogether."),
  Q(3,1,2,"Which command shows block devices with their filesystem type, UUID and mount point?",
    "lsblk -f",
    ["fdisk -t","df -u","mount --uuid"],
    "lsblk -f shows the whole device tree, including LVM, with filesystem details."),
  Q(3,1,2,"Which command creates a GPT label and one partition using the whole of /dev/sdb non-interactively?",
    "parted -s /dev/sdb mklabel gpt mkpart data 1MiB 100%",
    ["fdisk /dev/sdb --gpt --all","mkfs.gpt /dev/sdb","parted /dev/sdb resizepart 1 100%"],
    "parted -s runs in script mode. Starting at 1MiB keeps the partition aligned."),
  Q(3,1,2,"Which filesystem can be grown online but never shrunk?",
    "XFS",
    ["ext4","Btrfs","vfat"],
    "XFS grows with xfs_growfs and has no shrink operation. ext4 can shrink while unmounted."),
  Q(3,1,2,"How do you grow a mounted XFS filesystem after enlarging its logical volume?",
    "xfs_growfs <mount-point>",
    ["resize2fs <device>","xfs_repair -g <device>","mkfs.xfs -grow <device>"],
    "xfs_growfs takes the mount point. resize2fs is the ext4 equivalent and takes the device."),
  Q(3,1,2,"What is the correct sequence to create and enable a 2 GiB swap file?",
    "fallocate -l 2G /swapfile; chmod 600 /swapfile; mkswap /swapfile; swapon /swapfile",
    ["mkfs.swap /swapfile; mount /swapfile","dd to /dev/swap; swapon -a","swapon --create 2G /swapfile"],
    "Restrict the file to root, format it with mkswap, enable it with swapon, and add an fstab line (type swap, mount point none) for persistence."),
  Q(3,1,2,"umount /data fails with 'target is busy'. How do you find out what is using it?",
    "fuser -vm /data or lsof +f -- /data",
    ["df -i /data","mount -l /data","blkid /data"],
    "Both list processes with open files or a working directory on the filesystem. Stop them, then unmount."),
  Q(3,1,2,"Which mount options harden a data partition so programs cannot run from it and SUID bits are ignored?",
    "noexec,nosuid",
    ["ro,sync","nodev,relatime","defaults,user"],
    "noexec blocks executing binaries and nosuid ignores SUID/SGID bits on that filesystem. nodev blocks device files."),
  Q(3,1,3,"What are the three LVM layers, from disk upwards?",
    "Physical volume, volume group, logical volume",
    ["Partition, filesystem, mount point","Volume group, physical volume, logical volume","Disk, RAID set, extent"],
    "PVs (pvcreate) are pooled into a VG (vgcreate), from which LVs (lvcreate) are allocated."),
  Q(3,1,3,"Which single command grows logical volume /dev/vg0/data by 5 GiB and resizes its filesystem?",
    "lvextend -r -L +5G /dev/vg0/data",
    ["lvresize -L 5G /dev/vg0/data","vgextend -L +5G vg0","lvextend -L +5G /dev/vg0/data only"],
    "-r calls the filesystem resize tool for you. Without it, df keeps showing the old size."),
  Q(3,1,3,"Volume group vg0 has no free space. How do you add new disk /dev/sdd to it?",
    "pvcreate /dev/sdd, then vgextend vg0 /dev/sdd",
    ["lvcreate /dev/sdd vg0","vgcreate vg0 /dev/sdd","mkfs /dev/sdd and mount it in vg0"],
    "The disk must first become a physical volume; vgextend then adds it to the pool."),
  Q(3,1,3,"Which lvcreate option uses all remaining free space in the volume group?",
    "-l 100%FREE",
    ["-L max","--all","-s 100%"],
    "-l works in extents and accepts percentages. -L takes an absolute size such as 10G."),
  Q(3,1,3,"You must remove disk /dev/sdb from volume group vg0 without losing data. What do you run first?",
    "pvmove /dev/sdb",
    ["vgreduce vg0 /dev/sdb","pvremove /dev/sdb","lvremove vg0"],
    "pvmove migrates extents to other PVs in the group. Then vgreduce removes the PV and pvremove clears its label."),
  Q(3,1,3,"Which line in /etc/exports shares /srv/share read-write with 10.0.0.0/24?",
    "/srv/share 10.0.0.0/24(rw,sync)",
    ["/srv/share rw 10.0.0.0/24","10.0.0.0/24:/srv/share(rw)","share /srv 10.0.0.0/24 rw"],
    "Options in parentheses follow the client spec with no space. Run exportfs -rav after editing."),
  Q(3,1,3,"Which fstab option should an NFS mount have so it waits for the network at boot?",
    "_netdev",
    ["noauto","x-nfs-wait","bg-only"],
    "_netdev orders the mount after the network is online. Without it the mount can fail early in boot."),
  Q(3,1,3,"What does root_squash do on an NFS export?",
    "Maps requests from the client's root user to an unprivileged user",
    ["Gives remote root full access","Compresses files written by root","Blocks all root logins on the server"],
    "It is the default and prevents a client's root from acting as root on the exported files."),
  Q(3,1,3,"In autofs, which file maps a base directory such as /shares to its map file?",
    "/etc/auto.master (or a file in /etc/auto.master.d/)",
    ["/etc/fstab","/etc/autofs/shares.conf","/etc/exports"],
    "auto.master lines look like /shares /etc/auto.shares. The map file then lists keys and their remote locations."),
  Q(3,1,3,"An autofs map file contains: projects -rw nfs01:/srv/projects, with base directory /shares. When is it mounted?",
    "When someone accesses /shares/projects",
    ["At boot","Every 5 minutes","Only after mount -a"],
    "autofs mounts on demand and unmounts after an idle timeout, avoiding boot delays."),
  Q(3,2,2,"Which tool shows per-disk utilisation and latency to find a storage bottleneck?",
    "iostat -xz 1",
    ["free -h","lsblk -t","du -sh"],
    "High %util and await values in iostat point to a saturated disk. iotop shows which process is causing the I/O."),
  Q(3,2,2,"Which command shows which processes are generating the most disk I/O?",
    "iotop",
    ["iostat -p","vmstat -d","lsof -d"],
    "iotop lists processes by read and write throughput. iostat reports per device, not per process."),
  Q(3,1,2,"Which command shows the health and sync status of software RAID arrays?",
    "cat /proc/mdstat",
    ["lsblk --raid","mdadm --create","df -r"],
    "/proc/mdstat summarises every md array and rebuild progress. mdadm --detail /dev/md0 gives details for one."),
  Q(3,1,3,"How is an iSCSI disk different from an NFS share on the client?",
    "iSCSI appears as a block device the client formats itself; NFS is a shared filesystem",
    ["iSCSI cannot be mounted at boot","NFS is block-level and iSCSI is file-level","They are the same protocol"],
    "iSCSI exports raw block storage, normally used by one client at a time. NFS exports files that many clients can share."),
  Q(3,1,2,"How do you mount a 1 GiB RAM-backed filesystem at /mnt/fast?",
    "mount -t tmpfs -o size=1G tmpfs /mnt/fast",
    ["mount -t ramfs /dev/ram /mnt/fast --max 1G","mkfs.tmpfs -s 1G /mnt/fast","swapon -t ram /mnt/fast"],
    "tmpfs lives in memory (and can use swap) and is cleared at reboot. The size option caps it."),

  // ── Domain 4: Essential Commands ──
  Q(4,0,1,"Which command prints only the usernames of accounts with UID 1000 or higher?",
    "awk -F: '$3>=1000 {print $1}' /etc/passwd",
    ["grep 1000 /etc/passwd","cut -d: -f3 /etc/passwd | sort","sed -n '/1000/p' /etc/passwd"],
    "awk splits on : and compares the third field numerically. grep 1000 would match the text anywhere on the line."),
  Q(4,0,1,"Which command replaces every 'http://' with 'https://' in site.conf, editing the file in place?",
    "sed -i 's#http://#https://#g' site.conf",
    ["sed 's/http/https/' site.conf","grep -r http:// site.conf > site.conf","tr http:// https:// < site.conf"],
    "-i edits in place. A different delimiter (#) avoids escaping the slashes, and g replaces every match on each line."),
  Q(4,0,1,"Which find command lists files larger than 500 MB under /var?",
    "find /var -type f -size +500M",
    ["find /var -size 500M+","du /var -s 500M","ls -lR /var | grep 500M"],
    "-size +500M means more than 500 MiB. -type f limits results to regular files."),
  Q(4,0,1,"Which pipeline counts and ranks the most common values in column 1 of access.log?",
    "awk '{print $1}' access.log | sort | uniq -c | sort -rn",
    ["uniq -c access.log | sort","cut -f1 access.log | uniq","sort -u access.log | wc -l"],
    "uniq only collapses adjacent duplicates, so sort first. sort -rn ranks the counts from highest to lowest."),
  Q(4,0,0,"What does 'cmd > out.log 2>&1' do?",
    "Writes both stdout and stderr to out.log",
    ["Writes only errors to out.log","Appends output to out.log","Sends errors to the terminal and output to out.log"],
    "2>&1 points stderr at the same place as stdout, which was already redirected to the file."),
  Q(4,0,1,"Which tar command extracts backup.tar.gz into /restore?",
    "tar -xzf backup.tar.gz -C /restore",
    ["tar -czf backup.tar.gz /restore","tar -tf backup.tar.gz /restore","gunzip -d /restore backup.tar.gz"],
    "-x extracts, -z handles gzip, -f names the archive and -C changes to the target directory first."),
  Q(4,2,4,"Which Git commands record the current changes to all tracked and new files as a commit?",
    "git add -A, then git commit -m 'message'",
    ["git commit only","git push -m 'message'","git save -a"],
    "add stages the changes and commit records them. push only sends existing commits to a remote."),
  Q(4,2,4,"Which command shows the last five commits, one line each?",
    "git log --oneline -5",
    ["git status -5","git show --all 5","git diff HEAD~5"],
    "--oneline condenses each commit to its short hash and subject."),
  Q(4,2,4,"How do you discard uncommitted changes to config.yml and return it to the last commit?",
    "git restore config.yml",
    ["git revert config.yml","git push --force config.yml","git rm config.yml"],
    "restore (or git checkout -- file on old versions) resets the working copy. revert creates a new commit that undoes an existing one."),
  Q(4,2,4,"How do you create a branch named fix-dns and switch to it in one step?",
    "git switch -c fix-dns",
    ["git branch fix-dns --go","git merge fix-dns","git commit -b fix-dns"],
    "switch -c creates and checks out the branch. git checkout -b does the same on older Git versions."),
  Q(4,2,4,"Which command copies a remote repository to your machine for the first time?",
    "git clone <url>",
    ["git pull <url>","git fetch --new <url>","git init <url>"],
    "clone creates the local repository with full history and an origin remote. pull updates an existing clone."),
  Q(4,1,0,"A service fails to start. Which two commands give the fastest diagnosis?",
    "systemctl status <unit> and journalctl -u <unit> -b",
    ["ps aux and kill -9","top and free -h","dmesg -c and reboot"],
    "status shows the state, exit code and recent log lines; the journal shows the full error output."),
  Q(4,1,0,"A unit keeps restarting and is now 'failed' with 'start request repeated too quickly'. After fixing the cause, what clears it?",
    "systemctl reset-failed <unit>, then start it again",
    ["systemctl mask <unit>","systemctl daemon-reexec only","Reboot the server"],
    "systemd stops restarting after hitting the start limit. reset-failed clears the counter and the failed state."),
  Q(4,2,2,"The load average is 8.0 on a 2-CPU server and top shows high %wa. What is the likely bottleneck?",
    "Disk I/O; processes are waiting on storage",
    ["CPU computation","Network bandwidth","Too much free memory"],
    "%wa is time CPUs spend idle waiting for I/O. Confirm with iostat -xz and iotop."),
  Q(4,2,2,"In free -h output, which column best shows how much memory is available for new programs?",
    "available",
    ["free","shared","buff/cache only"],
    "Linux uses spare RAM as cache, so free looks low. available estimates what can be used without swapping."),
  Q(4,2,2,"Which tool reports historical CPU usage collected earlier in the day?",
    "sar (from the sysstat package)",
    ["top","uptime","htop"],
    "sar reads data collected periodically by sysstat, so you can see what happened before you logged in."),
  Q(4,2,2,"df shows / at 100% but du finds far less data. What is the most likely cause?",
    "A deleted file is still held open by a process; find it with lsof +L1",
    ["The filesystem needs fsck","Swap is full","The inode table is corrupt"],
    "The space is released only when the process closes the file. Restart the process or truncate the file through /proc."),
  Q(4,2,2,"Creating files fails with 'No space left on device', yet df -h shows 40% free. What should you check?",
    "Inode usage with df -i",
    ["The swap size","The CPU load","The SELinux mode"],
    "Each file uses an inode. Millions of tiny files can exhaust inodes while space remains."),
  Q(4,2,2,"How do you shrink the systemd journal to 500 MB right now?",
    "journalctl --vacuum-size=500M",
    ["rm -rf /var/log/journal/*","journalctl --rotate-only","systemctl stop journald && truncate"],
    "Vacuuming deletes the oldest archived journal files. Set SystemMaxUse= in journald.conf to keep it capped."),
  Q(4,2,2,"A service fails with 'Too many open files'. Where do you raise the limit for a systemd service?",
    "LimitNOFILE= in the service's unit or a drop-in override",
    ["/etc/security/limits.conf only","sysctl vm.max_files","ulimit -n in /etc/profile"],
    "Services started by systemd do not use PAM limits. Set LimitNOFILE= in the unit, then daemon-reload and restart."),
  Q(4,2,2,"A daemon fails with 'Address already in use'. Which command shows what holds the port?",
    "ss -tlnp | grep :<port>",
    ["ip link show","free -h","lsblk"],
    "ss shows the listening socket and the process that owns it."),
  Q(4,2,4,"Which command creates a self-signed certificate and new key valid for one year?",
    "openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 365 -subj '/CN=web01'",
    ["openssl genrsa -x509 -days 365 cert.pem","openssl x509 -new -out cert.pem","ssh-keygen -t x509 -f cert.pem"],
    "req -x509 produces a certificate instead of a CSR, -nodes leaves the key unencrypted, and -days sets validity."),
  Q(4,2,4,"Which command shows a certificate's subject and validity dates?",
    "openssl x509 -in cert.pem -noout -subject -dates",
    ["openssl req -in cert.pem -verify","openssl genrsa -in cert.pem","openssl s_client -in cert.pem"],
    "x509 reads certificates. -noout suppresses the encoded output and -text would show every field."),
  Q(4,2,4,"How do you check the certificate presented by a remote HTTPS server?",
    "openssl s_client -connect host:443 -servername host",
    ["openssl x509 -connect host:443","curl --cert host:443","openssl verify host:443"],
    "s_client performs a TLS handshake and prints the chain. -servername sends SNI so you get the right certificate."),
  Q(4,2,4,"What file is sent to a certificate authority to obtain a signed certificate?",
    "A certificate signing request (CSR) made with openssl req -new",
    ["The private key","The CA bundle","A PKCS#12 file containing the private key"],
    "The CSR contains your public key and requested names. The private key never leaves your server."),

  // ── Domain 5: Users and Groups ──
  Q(5,0,2,"Which command adds user alice to the docker group without removing her other groups?",
    "usermod -aG docker alice",
    ["usermod -G docker alice","groupadd alice docker","useradd -G docker alice"],
    "Without -a, -G replaces the entire supplementary group list."),
  Q(5,0,2,"Which command creates user bob with a home directory, Bash as the shell and UID 2001?",
    "useradd -m -s /bin/bash -u 2001 bob",
    ["useradd bob --home --bash 2001","adduser -u 2001 -s bash bob --nohome","usermod -m -u 2001 bob"],
    "-m creates the home directory from /etc/skel, -s sets the shell and -u the UID."),
  Q(5,0,2,"How do you force user carol to change her password at next login?",
    "chage -d 0 carol",
    ["passwd -l carol","chage -E 0 carol","usermod -L carol"],
    "Setting the last change date to 0 forces a change. chage -E 0 would expire the whole account instead."),
  Q(5,0,2,"Which command sets user dave's account to expire on 31 December 2026?",
    "chage -E 2026-12-31 dave",
    ["chage -M 2026-12-31 dave","passwd -x 2026-12-31 dave","usermod -s 2026-12-31 dave"],
    "-E sets the account expiry date. -M sets the maximum number of days between password changes."),
  Q(5,0,2,"Which file stores password hashes and ageing information?",
    "/etc/shadow",
    ["/etc/passwd","/etc/group","/etc/login.defs"],
    "/etc/shadow is readable only by root. /etc/passwd shows an x in the password field."),
  Q(5,0,2,"How do you stop a service account from logging in interactively while keeping it usable for the service?",
    "usermod -s /sbin/nologin svcacct",
    ["userdel svcacct","chmod 000 /home/svcacct","passwd -d svcacct"],
    "A nologin shell refuses interactive sessions while processes can still run as that user."),
  Q(5,0,2,"Where should an environment variable go so it is set for every user's login shell?",
    "A script in /etc/profile.d/",
    ["~/.bashrc of root only","/etc/environment.d/root","/etc/skel/.bash_history"],
    "Login shells source /etc/profile and every *.sh file in /etc/profile.d/. Personal settings go in ~/.bashrc or ~/.bash_profile."),
  Q(5,0,2,"Which file supplies the default files copied into a new user's home directory?",
    "/etc/skel",
    ["/etc/default/home","/usr/share/home","/etc/login.defs"],
    "useradd -m copies /etc/skel. Put standard dotfiles there to give every new user the same setup."),
  Q(5,2,1,"How do you limit members of the students group to 50 processes each, persistently?",
    "Add '@students hard nproc 50' to a file in /etc/security/limits.d/",
    ["ulimit -u 50 in the current shell","sysctl kernel.pid_max=50","Add nproc=50 to /etc/group"],
    "pam_limits applies limits.conf and limits.d at login. @ means a group, and hard sets the ceiling users cannot exceed."),
  Q(5,2,1,"What is the difference between soft and hard limits in limits.conf?",
    "Users can raise their soft limit up to the hard limit, but never above the hard limit",
    ["Soft limits apply only to root","Hard limits apply only at boot","They are identical"],
    "The soft limit is the effective default. ulimit can raise it as far as the hard limit, which only root can raise."),
  Q(5,0,3,"Which command gives user eve read and write access to report.txt without changing its owner or group?",
    "setfacl -m u:eve:rw report.txt",
    ["chmod o+rw report.txt","chown eve report.txt","usermod -aG report eve"],
    "An ACL adds a named user entry. chmod o+rw would give everyone access."),
  Q(5,0,3,"How do you make new files in /srv/team automatically grant the ops group rwx through ACLs?",
    "setfacl -d -m g:ops:rwx /srv/team",
    ["setfacl -m g:ops:rwx /srv/team only","chmod g+s /srv/team only","umask 000"],
    "The -d option sets a default ACL that new files and directories inherit."),
  Q(5,0,3,"getfacl shows 'user:frank:rwx  #effective:r--'. Why does frank only get read access?",
    "The ACL mask is r--, which limits all named entries",
    ["frank is not in the owning group","The sticky bit is set","SELinux overrides ACLs"],
    "The mask caps effective permissions for named users, named groups and the owning group. Raise it with setfacl -m m::rwx."),
  Q(5,0,2,"Which file tells the system to look up users in LDAP (through SSSD) as well as local files?",
    "/etc/nsswitch.conf",
    ["/etc/ldap.conf only","/etc/passwd","/etc/hosts"],
    "The passwd and group lines, for example passwd: files sss, decide where account lookups go."),
  Q(5,0,2,"An LDAP user exists, but 'id ldapuser' fails on the client. Which service should you check first?",
    "sssd, with systemctl status sssd",
    ["sshd","chronyd","nscd only"],
    "SSSD fetches and caches directory accounts. Check its status, logs and /etc/sssd/sssd.conf, which must be mode 600."),
];


export default function LinuxDashboard() {
  return (
    <div className="lnx-page">
      <header className="site-navigation lnx-header">
        <div className="site-navigation-inner">
          <a className="site-brand" href="../index.html" aria-label="Learn with Sam - return to Learning Hub">
            <span className="site-brand-mark">&gt;_</span><span>Learn with <em>Sam</em></span>
          </a>
        </div>
      </header>
      <main className="lnx-main"><LinuxLearningContent /></main>
      <footer className="lnx-footer">
        <p>&copy; 2026 <a href="../about/index.html">Saima Usman</a>. All Rights Reserved.</p>
        <p>Note: Unofficial study aid, not affiliated with the Linux Foundation. LFCS is a trademark of The Linux Foundation. Linux® is the registered trademark of Linus Torvalds.</p>
      </footer>
    </div>
  );
}

function LinuxLearningContent() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeTab, setActiveTab] = useState("topics");
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [openSolution, setOpenSolution] = useState(null);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [activeCheatTab, setActiveCheatTab] = useState("files");
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [mcqChecked, setMcqChecked] = useState({});
  const [activeScenario, setActiveScenario] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});
  const [copiedCmd, setCopiedCmd] = useState(null);
  const [glossaryWord, setGlossaryWord] = useState(null);
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => { window.scrollTo({top:0, behavior:"instant"}); }, [activeScenario]);
  useEffect(() => {
    if (!glossaryWord) return;
    const close = event => { if (event.key === "Escape") setGlossaryWord(null); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [glossaryWord]);

  const phase = PHASES[activePhase];
  const phaseId = phase.id;
  const color = phase.color;
  const rgb = phaseRGB[phaseId];
  const font = "'Poppins', sans-serif";
  const mono = "'Fira Code', 'Courier New', monospace";

  const pickAnswer = (qi, oi) => { if (mcqChecked[phaseId]) return; setMcqAnswers(p => ({...p, [`${phaseId}-${qi}`]:oi})); };
  const submitQuiz = () => setMcqChecked(p => ({...p, [phaseId]:true}));
  const retryQuiz = () => {
    setMcqChecked(p => ({...p, [phaseId]:false}));
    setMcqAnswers(p => { const n={...p}; phase.assessment.questions.forEach((_,i) => delete n[`${phaseId}-${i}`]); return n; });
  };
  const quizScore = pid => {
    const qs = PHASES.find(p => p.id===pid).assessment.questions;
    const c = qs.filter((q,i) => mcqAnswers[`${pid}-${i}`]===q.answer).length;
    return {correct:c, total:qs.length, pct:Math.round((c/qs.length)*100)};
  };
  const totalPct = () => {
    const done = PHASES.reduce((s,p) => s+(mcqChecked[p.id] ? quizScore(p.id).correct : 0), 0);
    const total = PHASES.reduce((s,p) => s+p.assessment.questions.length, 0);
    return Math.round((done/total)*100);
  };
  const answeredCount = phase.assessment.questions.filter((_,i) => mcqAnswers[`${phaseId}-${i}`]!==undefined).length;
  const allAnswered = answeredCount===phase.assessment.questions.length;
  const diffColor = d => d==="Easy" ? T.green : d==="Medium" ? T.amber : T.red;
  const toggleStep = (sid,si) => { const k=`${sid}-${si}`; setCompletedSteps(p => ({...p, [k]:!p[k]})); };
  const stepDone = (sid,si) => !!completedSteps[`${sid}-${si}`];
  const scenarioDone = scen => scen.steps.every((_,i) => stepDone(scen.id,i));

  const copyCmd = async (cmd) => {
    try { await navigator.clipboard.writeText(cmd); }
    catch {
      const ta = document.createElement('textarea');
      ta.value=cmd; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  const phaseScenarios = SCENARIOS.filter(s => s.phase===phaseId);

  const renderKeywords = (text, keywords) => {
    if (!keywords?.length) return text;
    const parts=[], sorted=[...keywords].sort((a,b) => b.length-a.length);
    let remaining=text, idx=0;
    while (remaining.length>0) {
      let found=false;
      for (const kw of sorted) {
        if (remaining.indexOf(kw)===0) {
          const def=GLOSSARY[kw];
          parts.push(<span key={idx++} role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") {e.preventDefault(); setGlossaryWord(kw);} }} onClick={() => setGlossaryWord(glossaryWord===kw ? null : kw)}
            style={{color, textDecoration:"underline dotted", cursor:"pointer", fontWeight:600}}
            title={def ? def.substring(0,80)+"…" : kw}>{kw}</span>);
          remaining=remaining.slice(kw.length); found=true; break;
        }
      }
      if (!found) {
        let nextIdx=remaining.length;
        for (const kw of sorted) { const i=remaining.indexOf(kw); if (i>0&&i<nextIdx) nextIdx=i; }
        parts.push(<span key={idx++}>{remaining.slice(0,nextIdx)}</span>);
        remaining=remaining.slice(nextIdx);
      }
    }
    return parts;
  };

  const renderExpl = (text, keywords) => text.split('\n').map((line,i) => {
    if (!line.trim()) return <br key={i}/>;
    return <p key={i} style={{margin:"0 0 6px", fontSize:"14px", color:T.textSub, lineHeight:"1.85", whiteSpace:"pre-wrap", wordBreak:"break-word"}}>{renderKeywords(line, keywords)}</p>;
  });

  // ── Mock exam state ──
  const [view, setView] = useState("dashboard");          // "dashboard" | "exam"
  const [exam, setExam] = useState(null);                  // null = menu, else { stage: "running" | "results", ... }
  const [tick, setTick] = useState(0);
  const [modal, setModal] = useState(null);                // null | "submit" | "quit"
  const [reviewFilter, setReviewFilter] = useState("wrong");
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    const fromHash = () => { if (location.hash === "#lnx-exam") { setActiveScenario(null); setView("exam"); } };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);
  useEffect(() => {
    if (!exam || exam.stage !== "running") return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    const warn = e => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => { clearInterval(id); window.removeEventListener("beforeunload", warn); };
  }, [exam && exam.stage]);
  useEffect(() => {
    if (exam && exam.stage === "running" && Date.now() >= exam.endAt) finishExam(true);
  }, [tick]);
  useEffect(() => {
    if (!modal) return;
    const close = e => { if (e.key === "Escape") setModal(null); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [modal]);

  const toTop = () => { try { window.scrollTo({top:0, behavior:"instant"}); } catch (e) {} };
  function openExam() { setView("exam"); toTop(); }
  function closeExam() {
    setView("dashboard");
    if (location.hash === "#lnx-exam") { try { window.history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
    toTop();
  }
  function buildQuestions(modeKey, weakKeys) {
    const cfg = EXAM_MODES[modeKey];
    let picked = [];
    if (modeKey === "weak") {
      const inWeak = q => weakKeys.includes(q.p + "-" + q.i);
      picked = shuffle(QUESTION_BANK.filter(inWeak)).slice(0, 15);
      if (picked.length < 8) {
        const filler = shuffle(QUESTION_BANK.filter(q => !inWeak(q))).slice(0, 8 - picked.length);
        picked = picked.concat(filler);
      }
    } else {
      DOMAIN_IDS.forEach(d => {
        const n = cfg.counts[d];
        if (n) picked = picked.concat(shuffle(QUESTION_BANK.filter(q => q.d === d)).slice(0, n));
      });
    }
    return shuffle(picked).map((q, id) => {
      const opts = shuffle([q.right, ...q.wrong]);
      return { ...q, id, opts, ans: opts.indexOf(q.right) };
    });
  }
  function startExam(modeKey, weakKeys) {
    const questions = buildQuestions(modeKey, weakKeys || []);
    const cfg = EXAM_MODES[modeKey];
    const minutes = cfg.minutes || Math.max(10, Math.ceil(questions.length * 1.5));
    const now = Date.now();
    setModal(null);
    setExam({ stage:"running", mode:modeKey, minutes, questions, answers:{}, flags:{}, current:0, startedAt:now, endAt:now + minutes * 60000 });
    toTop();
  }
  function scoreExam(ex, timedOut) {
    const perDomain = {};
    DOMAIN_IDS.forEach(d => { perDomain[d] = { c:0, t:0 }; });
    const perTopic = {};
    let correct = 0;
    ex.questions.forEach((q, idx) => {
      const ok = ex.answers[idx] === q.ans;
      if (ok) correct++;
      perDomain[q.d].t++;
      if (ok) perDomain[q.d].c++;
      const k = q.p + "-" + q.i;
      if (!perTopic[k]) perTopic[k] = { key:k, c:0, t:0, p:q.p, i:q.i, doms:{} };
      perTopic[k].t++;
      perTopic[k].doms[q.d] = true;
      if (ok) perTopic[k].c++;
    });
    const total = ex.questions.length;
    const weak = Object.values(perTopic)
      .filter(v => (v.c / v.t) * 100 < PASS_MARK)
      .sort((a, b) => a.c / a.t - b.c / b.t)
      .map(v => v.key);
    return {
      correct, total, pct:Math.round((correct / total) * 100), perDomain, perTopic, weak, timedOut,
      answered:Object.keys(ex.answers).length,
      timeUsed:Math.max(0, Math.min(Date.now(), ex.endAt) - ex.startedAt),
    };
  }
  function finishExam(timedOut) {
    if (!exam || exam.stage !== "running") return;
    const result = scoreExam(exam, !!timedOut);
    const domPct = {};
    DOMAIN_IDS.forEach(d => { const v = result.perDomain[d]; domPct[d] = v.t ? Math.round((v.c / v.t) * 100) : null; });
    const entry = { t:Date.now(), mode:exam.mode, pct:result.pct, correct:result.correct, total:result.total, domains:domPct, weak:result.weak };
    const next = [entry, ...history].slice(0, 10);
    setHistory(next);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch (e) {}
    setExam({ ...exam, stage:"results", result });
    setReviewFilter(result.correct < result.total ? "wrong" : "all");
    setModal(null);
    toTop();
  }
  function clearHistory() {
    setHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch (e) {}
  }
  const pickExamAnswer = (qi, oi) => setExam(ex => ({ ...ex, answers:{ ...ex.answers, [qi]:oi } }));
  const toggleExamFlag = qi => setExam(ex => ({ ...ex, flags:{ ...ex.flags, [qi]:!ex.flags[qi] } }));
  const goExamQuestion = qi => setExam(ex => ({ ...ex, current:Math.max(0, Math.min(ex.questions.length - 1, qi)) }));
  function studyTopic(p, i) {
    closeExam();
    setActivePhase(p);
    setActiveTab("topics");
    setExpandedTopic(i);
    setOpenSolution(null);
  }

  // ── Mock exam views ──
  const backBtn = {background:"transparent", border:"1px solid rgba(255,255,255,0.15)", color:T.textSub, padding:"6px 14px", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontFamily:font};
  const modeTotal = k => Object.values(EXAM_MODES[k].counts).reduce((a, b) => a + b, 0);
  const topicTitle = (p, i) => PHASES[p].topics[i].title;
  const domBadge = d => (
    <span title={DOMAINS[d].name} style={{background:`rgba(${DOMAINS[d].rgb},0.18)`, color:DOMAINS[d].color, fontSize:"10px", fontWeight:700, letterSpacing:"1px", padding:"3px 9px", borderRadius:"20px", whiteSpace:"nowrap"}}>
      D{d} · {DOMAINS[d].short.toUpperCase()}
    </span>
  );

  function renderExamMenu() {
    const last = history[0];
    const lastWeak = last && last.weak ? last.weak : [];
    const best = history.length ? Math.max(...history.map(h => h.pct)) : null;
    const cardBtn = (mk, onClick, label) => (
      <button onClick={onClick}
        style={{width:"100%", background:`rgba(${EXAM_MODES[mk].rgb},0.16)`, border:`1px solid ${EXAM_MODES[mk].color}`, color:EXAM_MODES[mk].color, padding:"8px 12px", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontWeight:600, fontFamily:font}}>
        {label}
      </button>
    );
    const modeCard = (k, extra) => {
      const m = EXAM_MODES[k];
      return (
        <div key={k} style={{background:T.card, border:`1px solid rgba(${m.rgb},0.3)`, borderRadius:"14px", overflow:"hidden", display:"flex", flexDirection:"column"}}>
          <div style={{height:"3px", background:m.color}}/>
          <div style={{padding:"16px", display:"flex", flexDirection:"column", flex:1}}>
            <div style={{fontSize:"26px", marginBottom:"6px", color:m.color}}>{m.icon}</div>
            <h3 style={{margin:"0 0 3px", fontSize:"15px", fontWeight:700}}>{m.label}</h3>
            {extra || <div style={{fontSize:"12px", color:m.color, fontWeight:600, marginBottom:"8px"}}>{modeTotal(k)} questions · {m.minutes} min</div>}
            <p style={{margin:"0 0 14px", fontSize:"12px", color:T.textSub, lineHeight:"1.65", flex:1}}>{m.desc}</p>
            {cardBtn(k, () => startExam(k), "▶ Start")}
          </div>
        </div>
      );
    };
    return (
      <div style={{padding:"20px var(--lnx-gutter)", width:"100%", boxSizing:"border-box"}}>
        <button onClick={closeExam} style={backBtn}>← Back to Dashboard</button>
        <div style={{display:"flex", alignItems:"center", gap:"12px", margin:"16px 0 8px", flexWrap:"wrap"}}>
          <div style={{fontSize:"34px"}}>📝</div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{color:T.green, fontSize:"11px", fontWeight:600, letterSpacing:"1.5px"}}>LFCS EXAM SIMULATOR</div>
            <h2 style={{margin:"2px 0 0", fontSize:"22px", fontWeight:700}}>Mock Exam Centre</h2>
          </div>
          {best !== null && (
            <div style={{background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", borderRadius:"12px", padding:"8px 14px", textAlign:"center"}}>
              <div style={{fontSize:"20px", fontWeight:700, color:T.green, lineHeight:1}}>{best}%</div>
              <div style={{fontSize:"10px", color:T.textMute, marginTop:"3px"}}>BEST SCORE</div>
            </div>
          )}
        </div>
        <p style={{margin:"0 0 14px", fontSize:"13px", color:T.textSub, lineHeight:"1.75"}}>
          Test your LFCS readiness under exam-like conditions: a countdown timer, no answers shown until you submit, and the option to flag questions for review.
          Afterwards you get your preparedness percentage, a score for each of the five LFCS domains, and a ranked list of the lessons to revisit first.
        </p>
        <div style={{display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"14px"}}>
          {["⏱ Timed", "🙈 No feedback until you submit", "⚖ Weighted like the real LFCS", "🔀 Questions and answers shuffled every attempt", `📚 ${QUESTION_BANK.length}-question bank`, `✅ Pass mark ${PASS_MARK}%`].map((c, i) => (
            <span key={i} style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:T.textSub, fontSize:"11px", padding:"4px 10px", borderRadius:"20px"}}>{c}</span>
          ))}
        </div>

        <div style={{background:"rgba(251,191,36,0.07)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:"12px", padding:"12px 14px", marginBottom:"18px", display:"flex", gap:"10px", alignItems:"flex-start"}}>
          <span style={{fontSize:"18px", flexShrink:0}}>💡</span>
          <p style={{margin:0, fontSize:"12px", color:T.textSub, lineHeight:"1.7"}}>
            <b style={{color:T.amber}}>The real LFCS is hands-on.</b> You solve 17-20 tasks in a live terminal in 2 hours. These questions test the knowledge behind those tasks: the commands, file paths, config files and troubleshooting logic.
            Pair them with the Labs and Scenarios tabs, and do the <a href="https://killer.sh/" target="_blank" rel="noopener noreferrer" style={{color:T.amber}}>killer.sh</a> simulator sessions included with your exam registration.
          </p>
        </div>

        <div style={{background:T.card, border:"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", padding:"14px 16px", marginBottom:"18px"}}>
          <div style={{color:T.pink, fontSize:"11px", fontWeight:600, letterSpacing:"1px", marginBottom:"10px"}}>LFCS EXAM DOMAINS</div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:"8px"}}>
            {DOMAIN_IDS.map(d => (
              <div key={d} style={{display:"flex", alignItems:"center", gap:"10px", background:`rgba(${DOMAINS[d].rgb},0.07)`, border:`1px solid rgba(${DOMAINS[d].rgb},0.25)`, borderRadius:"10px", padding:"8px 10px"}}>
                <div style={{fontSize:"18px", fontWeight:700, color:DOMAINS[d].color, minWidth:"42px"}}>{DOMAINS[d].weight}</div>
                <div style={{fontSize:"12px", color:T.textSub, lineHeight:"1.4"}}><b style={{color:T.text}}>D{d}</b> · {DOMAINS[d].name}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:"12px"}}>
          {["full", "quick"].map(k => modeCard(k))}
          {lastWeak.length > 0 && (
            <div style={{background:T.card, border:`1px solid rgba(${EXAM_MODES.weak.rgb},0.35)`, borderRadius:"14px", overflow:"hidden", display:"flex", flexDirection:"column"}}>
              <div style={{height:"3px", background:T.red}}/>
              <div style={{padding:"16px", display:"flex", flexDirection:"column", flex:1}}>
                <div style={{fontSize:"26px", marginBottom:"6px"}}>{EXAM_MODES.weak.icon}</div>
                <h3 style={{margin:"0 0 3px", fontSize:"15px", fontWeight:700}}>{EXAM_MODES.weak.label}</h3>
                <div style={{fontSize:"12px", color:T.red, fontWeight:600, marginBottom:"8px"}}>{lastWeak.length} weak lesson{lastWeak.length > 1 ? "s" : ""} from your last attempt</div>
                <p style={{margin:"0 0 14px", fontSize:"12px", color:T.textSub, lineHeight:"1.65", flex:1}}>
                  {lastWeak.slice(0, 4).map(k => { const [p, i] = k.split("-").map(Number); return topicTitle(p, i); }).join(" · ")}
                  {lastWeak.length > 4 ? ` · +${lastWeak.length - 4} more` : ""}
                </p>
                {cardBtn("weak", () => startExam("weak", lastWeak), "▶ Practise weak areas")}
              </div>
            </div>
          )}
        </div>
        <div style={{color:T.textMute, fontSize:"11px", fontWeight:600, letterSpacing:"1px", margin:"20px 0 10px"}}>DOMAIN DRILLS</div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"12px"}}>
          {DOMAIN_IDS.map(d => modeCard("d" + d, <div style={{fontSize:"12px", color:DOMAINS[d].color, fontWeight:600, marginBottom:"8px"}}>{DOMAINS[d].short} · {DOMAINS[d].weight} · {modeTotal("d" + d)} Qs · {EXAM_MODES["d" + d].minutes} min</div>))}
        </div>

        {history.length > 0 && (
          <div style={{marginTop:"22px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px"}}>
              <div style={{color:T.pink, fontSize:"11px", fontWeight:600, letterSpacing:"1px"}}>YOUR RECENT ATTEMPTS</div>
              <button onClick={clearHistory} style={{background:"transparent", border:"none", color:T.textDim, fontSize:"11px", cursor:"pointer", fontFamily:font, textDecoration:"underline"}}>Clear history</button>
            </div>
            <div style={{background:T.card, border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", overflow:"hidden"}}>
              {history.slice(0, 6).map((h, i) => {
                const b = band(h.pct);
                return (
                  <div key={i} style={{display:"flex", alignItems:"center", gap:"12px", padding:"10px 14px", borderBottom:i < Math.min(history.length, 6) - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", flexWrap:"wrap"}}>
                    <div style={{minWidth:"52px", fontSize:"18px", fontWeight:700, color:b.color}}>{h.pct}%</div>
                    <div style={{flex:1, minWidth:"140px"}}>
                      <div style={{fontSize:"13px", fontWeight:600}}>{EXAM_MODES[h.mode] ? EXAM_MODES[h.mode].label : h.mode}</div>
                      <div style={{fontSize:"11px", color:T.textMute}}>{new Date(h.t).toLocaleString([], { dateStyle:"medium", timeStyle:"short" })} · {h.correct}/{h.total} correct</div>
                    </div>
                    <div style={{display:"flex", gap:"6px", flexWrap:"wrap"}}>
                      {DOMAIN_IDS.map(d => h.domains && h.domains[d] !== null && h.domains[d] !== undefined && (
                        <span key={d} style={{fontSize:"10px", color:DOMAINS[d].color, background:`rgba(${DOMAINS[d].rgb},0.12)`, padding:"2px 7px", borderRadius:"5px", fontWeight:600}}>D{d} {h.domains[d]}%</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{fontSize:"11px", color:T.textDim, marginTop:"6px"}}>Saved in this browser only.</div>
          </div>
        )}

        <p style={{margin:"20px 0 0", fontSize:"11px", color:T.textDim, lineHeight:"1.7"}}>
          These are original practice questions written for this dashboard, not real exam questions. The real LFCS pass mark is {PASS_MARK}% and every task is performance-based, so your percentage here is an indicator of readiness, not a prediction.
        </p>
      </div>
    );
  }

  function renderExamRunning() {
    const ex = exam;
    const qs = ex.questions;
    const q = qs[ex.current];
    const remaining = Math.max(0, Math.round((ex.endAt - Date.now()) / 1000));
    const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
    const ss = String(remaining % 60).padStart(2, "0");
    const low = remaining <= 300;
    const answered = qs.reduce((n, _, i) => n + (ex.answers[i] !== undefined ? 1 : 0), 0);
    const flagged = qs.reduce((n, _, i) => n + (ex.flags[i] ? 1 : 0), 0);
    const isLast = ex.current === qs.length - 1;
    const chosen = ex.answers[ex.current];
    const sbtn = (c, filled) => ({background:filled ? `rgba(${c},0.18)` : "transparent", border:`1px solid rgb(${c})`, color:`rgb(${c})`, padding:"7px 14px", borderRadius:"8px", cursor:"pointer", fontSize:"12px", fontWeight:600, fontFamily:font, whiteSpace:"nowrap"});
    return (
      <div>
        <div style={{position:"sticky", top:68, zIndex:20, background:T.surface, borderBottom:"1px solid rgba(255,255,255,0.09)", padding:"10px var(--lnx-gutter)"}}>
          <div style={{display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap"}}>
            <div style={{flex:1, minWidth:"170px"}}>
              <div style={{fontSize:"10px", color:T.textDim, letterSpacing:"1.5px", fontWeight:600}}>{EXAM_MODES[ex.mode].label.toUpperCase()}</div>
              <div style={{fontSize:"14px", fontWeight:600}}>
                Question {ex.current + 1} of {qs.length} <span style={{color:T.textMute, fontWeight:400, fontSize:"12px"}}>· {answered} answered</span>
              </div>
              <div style={{height:"4px", background:"rgba(255,255,255,0.08)", borderRadius:"2px", marginTop:"6px", overflow:"hidden"}}>
                <div style={{height:"100%", width:`${(answered / qs.length) * 100}%`, background:T.green, transition:"width .2s"}}/>
              </div>
            </div>
            <div role="timer" aria-label="Time remaining" style={{fontFamily:mono, fontSize:"18px", fontWeight:500, color:low ? T.red : T.text, background:low ? "rgba(248,113,113,0.12)" : "rgba(255,255,255,0.06)", border:`1px solid ${low ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.12)"}`, padding:"6px 12px", borderRadius:"10px"}}>
              ⏱ {mm}:{ss}
            </div>
            <button onClick={() => setModal("submit")} style={sbtn("52,211,153", true)}>Finish &amp; Submit</button>
            <button onClick={() => setModal("quit")} aria-label="Exit exam" title="Exit exam" style={sbtn("122,143,166", false)}>✕</button>
          </div>
        </div>

        <div style={{padding:"18px var(--lnx-gutter)", width:"100%", boxSizing:"border-box", display:"flex", gap:"16px", flexWrap:"wrap", alignItems:"flex-start"}}>
          <div style={{flex:"3 1 360px", minWidth:0}}>
            <div style={{background:T.card, border:"1px solid rgba(255,255,255,0.09)", borderRadius:"14px", padding:"18px"}}>
              <div style={{display:"flex", gap:"8px", alignItems:"center", marginBottom:"12px", flexWrap:"wrap"}}>
                {domBadge(q.d)}
                <span style={{fontSize:"11px", color:T.textMute}}>Question {ex.current + 1}</span>
                {ex.flags[ex.current] && <span style={{fontSize:"11px", color:T.amber, fontWeight:600}}>⚑ Marked for review</span>}
              </div>
              <div style={{fontSize:"15px", fontWeight:600, lineHeight:"1.7", marginBottom:"14px", wordBreak:"break-word"}}>{q.q}</div>
              <div role="radiogroup" aria-label={`Question ${ex.current + 1} options`} style={{display:"flex", flexDirection:"column", gap:"8px"}}>
                {q.opts.map((opt, oi) => {
                  const sel = chosen === oi;
                  return (
                    <div key={oi} role="radio" aria-checked={sel} tabIndex={0} onClick={() => pickExamAnswer(ex.current, oi)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickExamAnswer(ex.current, oi); } }}
                      style={{display:"flex", alignItems:"flex-start", gap:"10px", padding:"11px 14px", borderRadius:"10px", cursor:"pointer", background:sel ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.03)", border:`1px solid ${sel ? T.cyan : "rgba(255,255,255,0.1)"}`}}>
                      <div style={{width:"16px", height:"16px", borderRadius:"50%", border:`2px solid ${sel ? T.cyan : "rgba(255,255,255,0.25)"}`, background:sel ? T.cyan : "transparent", flexShrink:0, marginTop:"2px"}}/>
                      <span style={{fontSize:"14px", color:sel ? T.text : T.textSub, lineHeight:"1.6", wordBreak:"break-word"}}>{opt}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{display:"flex", gap:"8px", marginTop:"16px", flexWrap:"wrap", alignItems:"center"}}>
                <button onClick={() => goExamQuestion(ex.current - 1)} disabled={ex.current === 0}
                  style={{...sbtn("184,197,214", false), opacity:ex.current === 0 ? 0.4 : 1, cursor:ex.current === 0 ? "not-allowed" : "pointer"}}>← Previous</button>
                <button onClick={() => toggleExamFlag(ex.current)} style={sbtn("251,191,36", !!ex.flags[ex.current])}>
                  {ex.flags[ex.current] ? "⚑ Unmark" : "⚐ Mark for review"}
                </button>
                <div style={{flex:1}}/>
                {isLast
                  ? <button onClick={() => setModal("submit")} style={sbtn("52,211,153", true)}>Review &amp; Submit</button>
                  : <button onClick={() => goExamQuestion(ex.current + 1)} style={sbtn("34,211,238", true)}>Next →</button>}
              </div>
            </div>
          </div>

          <div style={{flex:"1 1 230px", minWidth:0}}>
            <div style={{background:T.card, border:"1px solid rgba(255,255,255,0.09)", borderRadius:"14px", padding:"14px"}}>
              <div style={{color:T.pink, fontSize:"11px", fontWeight:600, letterSpacing:"1px", marginBottom:"10px"}}>QUESTION NAVIGATOR</div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(34px,1fr))", gap:"6px"}}>
                {qs.map((_, i) => {
                  const a = ex.answers[i] !== undefined;
                  const f = !!ex.flags[i];
                  const cur = i === ex.current;
                  return (
                    <button key={i} onClick={() => goExamQuestion(i)} aria-label={`Question ${i + 1}${a ? ", answered" : ""}${f ? ", flagged" : ""}`}
                      style={{position:"relative", height:"34px", borderRadius:"8px", cursor:"pointer", fontSize:"12px", fontWeight:600, fontFamily:font, color:a ? T.cyan : T.textMute, background:a ? "rgba(34,211,238,0.14)" : "rgba(255,255,255,0.04)", border:cur ? `2px solid ${T.text}` : `1px solid ${a ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.12)"}`, padding:0}}>
                      {i + 1}
                      {f && <span style={{position:"absolute", top:"-3px", right:"-3px", width:"9px", height:"9px", borderRadius:"50%", background:T.amber, border:`1px solid ${T.card}`}}/>}
                    </button>
                  );
                })}
              </div>
              <div style={{display:"flex", flexWrap:"wrap", gap:"10px", marginTop:"12px", fontSize:"11px", color:T.textMute}}>
                <span><span style={{color:T.cyan}}>■</span> Answered ({answered})</span>
                <span><span style={{color:T.textDim}}>■</span> Unanswered ({qs.length - answered})</span>
                <span><span style={{color:T.amber}}>●</span> Flagged ({flagged})</span>
              </div>
            </div>
          </div>
        </div>

        {modal && (
          <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.7)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px"}}
            onClick={() => setModal(null)}>
            <div role="dialog" aria-modal="true" aria-label={modal === "quit" ? "Exit exam" : "Submit exam"} style={{background:T.card, border:`1px solid ${modal === "quit" ? "rgba(248,113,113,0.45)" : "rgba(52,211,153,0.45)"}`, borderRadius:"14px", padding:"20px 22px", maxWidth:"420px", width:"100%", boxSizing:"border-box"}}
              onClick={e => e.stopPropagation()}>
              <h3 style={{margin:"0 0 8px", fontSize:"17px", fontWeight:700, color:modal === "quit" ? T.red : T.green}}>
                {modal === "quit" ? "Exit this exam?" : "Submit your exam?"}
              </h3>
              <p style={{margin:"0 0 16px", fontSize:"13px", color:T.textSub, lineHeight:"1.7"}}>
                {modal === "quit"
                  ? "Your progress in this attempt will be lost and no score will be saved."
                  : `You have answered ${answered} of ${qs.length} questions.` +
                    (qs.length - answered > 0 ? ` ${qs.length - answered} unanswered will count as incorrect.` : "") +
                    (flagged > 0 ? ` ${flagged} question${flagged > 1 ? "s are" : " is"} still flagged for review.` : "")}
              </p>
              <div style={{display:"flex", gap:"8px", justifyContent:"flex-end", flexWrap:"wrap"}}>
                <button autoFocus onClick={() => setModal(null)} style={sbtn("184,197,214", false)}>{modal === "quit" ? "Keep going" : "Keep working"}</button>
                {modal === "quit"
                  ? <button onClick={() => { setModal(null); setExam(null); }} style={sbtn("248,113,113", true)}>Exit exam</button>
                  : <button onClick={() => finishExam(false)} style={sbtn("52,211,153", true)}>Submit exam</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderExamResults() {
    const ex = exam;
    const r = ex.result;
    const qs = ex.questions;
    const lvl = readiness(r.pct);
    const passed = r.pct >= PASS_MARK;
    const topics = Object.values(r.perTopic)
      .map(v => ({ ...v, pct:Math.round((v.c / v.t) * 100), title:topicTitle(v.p, v.i), doms:Object.keys(v.doms).map(Number).sort() }))
      .sort((a, b) => a.pct - b.pct || b.t - a.t);
    const weakT = topics.filter(t => t.pct < PASS_MARK);
    const fairT = topics.filter(t => t.pct >= PASS_MARK && t.pct < 80);
    const strongT = topics.filter(t => t.pct >= 80);
    const domRows = DOMAIN_IDS.map(d => ({ d, ...r.perDomain[d], pct:r.perDomain[d].t ? Math.round((r.perDomain[d].c / r.perDomain[d].t) * 100) : null })).filter(x => x.t > 0);
    const weakestDom = [...domRows].sort((a, b) => a.pct - b.pct)[0];
    const mins = Math.floor(r.timeUsed / 60000);
    const secs = Math.round((r.timeUsed % 60000) / 1000);
    const CIRC = 2 * Math.PI * 58;
    const items = qs.map((q, i) => ({ q, i, ok:ex.answers[i] === q.ans, flagged:!!ex.flags[i] }));
    const shown = items.filter(it => reviewFilter === "all" ? true : reviewFilter === "flagged" ? it.flagged : !it.ok);
    const wrongCount = items.filter(it => !it.ok).length;
    const flaggedCount = items.filter(it => it.flagged).length;
    const pill = (key, label) => (
      <button key={key} onClick={() => setReviewFilter(key)} aria-pressed={reviewFilter === key}
        style={{background:reviewFilter === key ? "rgba(34,211,238,0.16)" : "transparent", border:`1px solid ${reviewFilter === key ? T.cyan : "rgba(255,255,255,0.12)"}`, color:reviewFilter === key ? T.cyan : T.textMute, padding:"5px 12px", borderRadius:"20px", cursor:"pointer", fontSize:"12px", fontWeight:600, fontFamily:font}}>
        {label}
      </button>
    );
    const act = (c, filled) => ({background:filled ? `rgba(${c},0.18)` : "transparent", border:`1px solid rgb(${c})`, color:`rgb(${c})`, padding:"9px 16px", borderRadius:"10px", cursor:"pointer", fontSize:"13px", fontWeight:600, fontFamily:font});
    return (
      <div style={{padding:"20px var(--lnx-gutter)", width:"100%", boxSizing:"border-box"}}>
        <button onClick={closeExam} style={backBtn}>← Back to Dashboard</button>

        {/* Headline */}
        <div style={{marginTop:"16px", background:`rgba(${lvl.rgb},0.07)`, border:`2px solid rgba(${lvl.rgb},0.35)`, borderRadius:"16px", padding:"20px", display:"flex", gap:"22px", alignItems:"center", flexWrap:"wrap"}}>
          <div style={{position:"relative", width:"140px", height:"140px", flexShrink:0}}>
            <svg width="140" height="140" viewBox="0 0 140 140" style={{transform:"rotate(-90deg)"}} aria-hidden="true">
              <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12"/>
              <circle cx="70" cy="70" r="58" fill="none" stroke={lvl.color} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(r.pct / 100) * CIRC} ${CIRC}`}/>
            </svg>
            <div style={{position:"absolute", top:0, left:0, right:0, bottom:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
              <div style={{fontSize:"34px", fontWeight:700, color:lvl.color, lineHeight:1}}>{r.pct}%</div>
              <div style={{fontSize:"10px", color:T.textMute, marginTop:"4px", letterSpacing:"1px"}}>PREPARED</div>
            </div>
          </div>
          <div style={{flex:1, minWidth:"220px"}}>
            <div style={{fontSize:"11px", color:T.textMute, letterSpacing:"1.5px", fontWeight:600}}>{EXAM_MODES[ex.mode].label.toUpperCase()} · RESULT</div>
            <div style={{display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap", margin:"3px 0 6px"}}>
              <div style={{fontSize:"22px", fontWeight:700, color:lvl.color}}>{lvl.label} {lvl.emoji}</div>
              <span style={{background:passed ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)", border:`1px solid ${passed ? T.green : T.red}`, color:passed ? T.green : T.red, fontSize:"11px", fontWeight:700, letterSpacing:"1px", padding:"3px 10px", borderRadius:"20px"}}>
                {passed ? `ABOVE ${PASS_MARK}% PASS MARK` : `BELOW ${PASS_MARK}% PASS MARK`}
              </span>
            </div>
            <p style={{margin:"0 0 8px", fontSize:"13px", color:T.textSub, lineHeight:"1.7"}}>{lvl.msg}</p>
            <div style={{fontSize:"12px", color:T.textMute, lineHeight:"1.7"}}>
              {r.correct} of {r.total} correct · {r.answered} answered · time used {mins}m {String(secs).padStart(2, "0")}s of {ex.minutes}m
              {r.timedOut && <span style={{color:T.red}}> · time expired, unanswered questions counted as incorrect</span>}
            </div>
          </div>
        </div>

        {/* Domain breakdown */}
        <div style={{marginTop:"18px", background:T.card, border:"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", padding:"16px"}}>
          <div style={{color:T.pink, fontSize:"11px", fontWeight:600, letterSpacing:"1px", marginBottom:"12px"}}>SCORE BY LFCS DOMAIN</div>
          <div style={{display:"flex", flexDirection:"column", gap:"14px"}}>
            {domRows.map(row => {
              const b = band(row.pct);
              return (
                <div key={row.d}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:"10px", flexWrap:"wrap", marginBottom:"5px"}}>
                    <div style={{display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap"}}>
                      <span style={{fontSize:"13px", fontWeight:600, color:DOMAINS[row.d].color}}>D{row.d}</span>
                      <span style={{fontSize:"13px", fontWeight:600}}>{DOMAINS[row.d].name}</span>
                      <span style={{fontSize:"11px", color:T.textDim}}>exam weight {DOMAINS[row.d].weight}</span>
                    </div>
                    <div style={{fontSize:"12px", color:T.textMute}}>
                      {row.c}/{row.t} · <span style={{color:b.color, fontWeight:700}}>{row.pct}% {b.label}</span>
                    </div>
                  </div>
                  <div style={{position:"relative", height:"10px", background:"rgba(255,255,255,0.07)", borderRadius:"5px", overflow:"hidden"}}>
                    <div style={{height:"100%", width:`${row.pct}%`, background:b.color, borderRadius:"5px"}}/>
                    <div title={`${PASS_MARK}% pass mark`} style={{position:"absolute", top:0, bottom:0, left:`${PASS_MARK}%`, width:"2px", background:"rgba(255,255,255,0.45)"}}/>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{fontSize:"11px", color:T.textDim, marginTop:"12px"}}>
            Strong 80%+ · Almost there {PASS_MARK}-79% · Weak below {PASS_MARK}%. The white tick marks the real LFCS pass mark.
          </div>
        </div>

        {/* Focus areas */}
        <div style={{marginTop:"18px", background:T.card, border:`1px solid ${weakT.length ? "rgba(248,113,113,0.35)" : "rgba(52,211,153,0.35)"}`, borderRadius:"14px", padding:"16px"}}>
          <div style={{color:weakT.length ? T.red : T.green, fontSize:"11px", fontWeight:600, letterSpacing:"1px", marginBottom:"8px"}}>
            {weakT.length ? "🎯 WHERE TO CONCENTRATE" : "✅ NO WEAK AREAS FOUND"}
          </div>
          {weakT.length > 0 ? (
            <>
              <p style={{margin:"0 0 12px", fontSize:"13px", color:T.textSub, lineHeight:"1.7"}}>
                Spend most of your study time on {weakT.slice(0, 3).map(t => t.title).join(", ")}
                {weakT.length > 3 ? ` and ${weakT.length - 3} more` : ""}
                {weakestDom ? `. Your weakest domain is D${weakestDom.d}, ${DOMAINS[weakestDom.d].name} (${weakestDom.pct}%).` : "."}
              </p>
              <div style={{display:"flex", flexDirection:"column"}}>
                {weakT.map((t, i) => (
                  <div key={t.key} style={{display:"flex", alignItems:"center", gap:"12px", padding:"10px 0", borderTop:i ? "1px solid rgba(255,255,255,0.06)" : "none", flexWrap:"wrap"}}>
                    <div style={{flex:1, minWidth:"190px"}}>
                      <div style={{display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap", marginBottom:"5px"}}>
                        <span style={{fontSize:"13px", fontWeight:600, wordBreak:"break-word"}}>{t.title}</span>
                        <span style={{fontSize:"10px", color:T.textDim}}>{PHASES[t.p].badge} lesson</span>
                        {t.doms.map(d => <span key={d} style={{fontSize:"10px", color:DOMAINS[d].color, background:`rgba(${DOMAINS[d].rgb},0.12)`, padding:"1px 6px", borderRadius:"5px", fontWeight:600}}>D{d}</span>)}
                      </div>
                      <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
                        <div style={{flex:1, maxWidth:"220px", height:"6px", background:"rgba(255,255,255,0.07)", borderRadius:"3px", overflow:"hidden"}}>
                          <div style={{height:"100%", width:`${t.pct}%`, background:T.red}}/>
                        </div>
                        <span style={{fontSize:"11px", color:T.red, fontWeight:700}}>{t.pct}%</span>
                        <span style={{fontSize:"11px", color:T.textDim}}>{t.c}/{t.t} correct</span>
                      </div>
                    </div>
                    <button onClick={() => studyTopic(t.p, t.i)} style={act("34,211,238", false)}>Study lesson →</button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{margin:0, fontSize:"13px", color:T.textSub, lineHeight:"1.7"}}>
              Every lesson in this attempt scored {PASS_MARK}% or higher. {fairT.length ? "Polish the amber lessons below, then " : ""}Take another full mock exam to confirm your result across all domains.
            </p>
          )}
          {(fairT.length > 0 || strongT.length > 0) && (
            <div style={{marginTop:"14px", paddingTop:"12px", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", gap:"10px"}}>
              {fairT.length > 0 && (
                <div>
                  <div style={{fontSize:"11px", color:T.amber, fontWeight:600, letterSpacing:"1px", marginBottom:"6px"}}>KEEP REVISING ({PASS_MARK}-79%)</div>
                  <div style={{display:"flex", flexWrap:"wrap", gap:"6px"}}>
                    {fairT.map(t => (
                      <button key={t.key} onClick={() => studyTopic(t.p, t.i)}
                        style={{background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.3)", color:T.amber, fontSize:"11px", padding:"4px 10px", borderRadius:"6px", cursor:"pointer", fontFamily:font}}>
                        {t.title} · {t.pct}%
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {strongT.length > 0 && (
                <div>
                  <div style={{fontSize:"11px", color:T.green, fontWeight:600, letterSpacing:"1px", marginBottom:"6px"}}>STRONG (80%+)</div>
                  <div style={{display:"flex", flexWrap:"wrap", gap:"6px"}}>
                    {strongT.map(t => (
                      <span key={t.key} style={{background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", color:T.green, fontSize:"11px", padding:"4px 10px", borderRadius:"6px"}}>
                        {t.title} · {t.pct}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {r.total < 30 && (
            <div style={{fontSize:"11px", color:T.textDim, marginTop:"12px"}}>
              Short test: each lesson has only a few questions, so treat lesson scores as hints. The Full Mock Exam gives a more reliable picture.
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{display:"flex", gap:"10px", flexWrap:"wrap", margin:"18px 0"}}>
          {weakT.length > 0 && <button onClick={() => startExam("weak", r.weak)} style={act("248,113,113", true)}>🩺 Practise weak areas</button>}
          <button onClick={() => startExam(ex.mode === "weak" ? "full" : ex.mode, r.weak)} style={act("52,211,153", true)}>🔁 Retake {ex.mode === "weak" ? "a full mock" : "this exam type"}</button>
          <button onClick={() => setExam(null)} style={act("184,197,214", false)}>📋 Exam menu</button>
        </div>

        {/* Answer review */}
        <div style={{background:T.card, border:"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", padding:"16px"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:"10px", flexWrap:"wrap", marginBottom:"12px"}}>
            <div style={{color:T.pink, fontSize:"11px", fontWeight:600, letterSpacing:"1px"}}>ANSWER REVIEW</div>
            <div style={{display:"flex", gap:"6px", flexWrap:"wrap"}}>
              {pill("wrong", `Incorrect (${wrongCount})`)}
              {pill("flagged", `Flagged (${flaggedCount})`)}
              {pill("all", `All (${qs.length})`)}
            </div>
          </div>
          {shown.length === 0 && (
            <div style={{textAlign:"center", color:T.textMute, fontSize:"13px", padding:"18px 0"}}>Nothing to show for this filter.</div>
          )}
          <div style={{display:"flex", flexDirection:"column", gap:"12px"}}>
            {shown.map(({ q, i, ok }) => {
              const chosenOpt = ex.answers[i];
              return (
                <div key={i} style={{border:`1px solid ${ok ? "rgba(52,211,153,0.35)" : "rgba(248,113,113,0.35)"}`, borderRadius:"12px", padding:"14px", background:"rgba(255,255,255,0.02)"}}>
                  <div style={{display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap", marginBottom:"8px"}}>
                    <span style={{fontSize:"11px", fontWeight:700, color:ok ? T.green : T.red}}>{ok ? "✓ Correct" : chosenOpt === undefined ? "✗ Not answered" : "✗ Incorrect"}</span>
                    {domBadge(q.d)}
                    <span style={{fontSize:"11px", color:T.textMute}}>{topicTitle(q.p, q.i)}</span>
                    {ex.flags[i] && <span style={{fontSize:"11px", color:T.amber}}>⚑ flagged</span>}
                  </div>
                  <div style={{fontSize:"14px", fontWeight:600, lineHeight:"1.65", marginBottom:"10px", wordBreak:"break-word"}}>{i + 1}. {q.q}</div>
                  <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
                    {q.opts.map((opt, oi) => {
                      const isRight = oi === q.ans;
                      const isMine = oi === chosenOpt;
                      let bg = "rgba(255,255,255,0.03)", bc = "rgba(255,255,255,0.08)", tc = T.textSub;
                      if (isRight) { bg = "rgba(52,211,153,0.12)"; bc = T.green; tc = "#D1FAE5"; }
                      if (isMine && !isRight) { bg = "rgba(248,113,113,0.12)"; bc = T.red; tc = "#FEE2E2"; }
                      return (
                        <div key={oi} style={{display:"flex", gap:"8px", alignItems:"flex-start", padding:"7px 10px", borderRadius:"8px", background:bg, border:`1px solid ${bc}`}}>
                          <span style={{fontSize:"11px", fontWeight:700, color:isRight ? T.green : isMine ? T.red : T.textDim, minWidth:"14px", marginTop:"2px"}}>{isRight ? "✓" : isMine ? "✗" : "·"}</span>
                          <span style={{fontSize:"13px", color:tc, lineHeight:"1.55", wordBreak:"break-word"}}>
                            {opt}{isMine && <span style={{color:T.textMute, fontSize:"11px"}}>  (your answer)</span>}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{marginTop:"10px", fontSize:"12px", color:T.textSub, lineHeight:"1.7", borderLeft:`3px solid ${DOMAINS[q.d].color}`, paddingLeft:"10px"}}>
                    {q.explain}
                    {!ok && (
                      <button onClick={() => studyTopic(q.p, q.i)} style={{marginLeft:"8px", background:"transparent", border:"none", color:T.cyan, cursor:"pointer", fontSize:"12px", fontFamily:font, textDecoration:"underline"}}>
                        Study this lesson →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (view === "exam") {
    return (
      <>
        <style>{POPPINS}{GLOBAL_CSS}</style>
        <div id="lnx-exam" style={{background:T.bg, fontFamily:font, color:T.text}}>
          {!exam ? renderExamMenu() : exam.stage === "running" ? renderExamRunning() : renderExamResults()}
        </div>
      </>
    );
  }

  if (activeScenario) {
    const scen = SCENARIOS.find(s => s.id===activeScenario);
    const scRGB = phaseRGB[scen.phase];
    const scColor = PHASES.find(p => p.id===scen.phase).color;
    const totalCmds = scen.steps.reduce((s,st) => s+st.cmds.length, 0);
    const doneCmds = scen.steps.reduce((s,st,si) => s+(stepDone(scen.id,si) ? st.cmds.length : 0), 0);
    const pct = Math.round((doneCmds/totalCmds)*100);
    return (
      <>
        <style>{POPPINS}{GLOBAL_CSS}</style>
        <div style={{background:T.bg, fontFamily:font, color:T.text}}>
          <div className="lnx-band" style={{background:`rgba(${scRGB},0.06)`, borderBottom:`1px solid rgba(${scRGB},0.25)`, padding:"16px var(--lnx-gutter)"}}>
            <button onClick={() => setActiveScenario(null)} style={{background:"transparent", border:`1px solid rgba(255,255,255,0.15)`, color:T.textSub, padding:"6px 14px", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontFamily:font, marginBottom:"12px"}}>← Back</button>
            <div style={{display:"flex", alignItems:"flex-start", gap:"12px", flexWrap:"wrap"}}>
              <div style={{fontSize:"36px", flexShrink:0}}>{scen.emoji}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:"flex", gap:"6px", marginBottom:"6px", flexWrap:"wrap"}}>
                  <span style={{background:`rgba(${scRGB},0.18)`, color:scColor, fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", padding:"3px 10px", borderRadius:"20px"}}>{scen.difficulty.toUpperCase()}</span>
                  <span style={{background:"rgba(255,255,255,0.07)", color:T.textMute, fontSize:"11px", padding:"3px 10px", borderRadius:"20px"}}>{scen.duration}</span>
                  <span style={{background:"rgba(248,113,113,0.15)", color:T.red, fontSize:"11px", fontWeight:600, padding:"3px 10px", borderRadius:"20px"}}>LFCS: {scen.examWeight}</span>
                </div>
                <h2 style={{margin:"0 0 4px", fontSize:"20px", fontWeight:700, color:T.text}}>{scen.title}</h2>
                <p style={{margin:"0 0 8px", color:T.textSub, fontSize:"13px"}}>{scen.subtitle}</p>
                <p style={{margin:0, color:T.textMute, fontSize:"13px", lineHeight:"1.7"}}><b style={{color:scColor}}>Goal: </b>{scen.goal}</p>
              </div>
              <div style={{background:`rgba(${scRGB},0.1)`, border:`1px solid rgba(${scRGB},0.3)`, borderRadius:"12px", padding:"12px 16px", textAlign:"center", flexShrink:0}}>
                <div style={{fontSize:"26px", fontWeight:700, color:scColor, lineHeight:1}}>{pct}%</div>
                <div style={{fontSize:"11px", color:T.textMute, marginTop:"3px"}}>DONE</div>
                <div style={{fontSize:"11px", color:T.textDim, marginTop:"2px"}}>{doneCmds}/{totalCmds}</div>
              </div>
            </div>
            <div style={{display:"flex", flexWrap:"wrap", gap:"5px", marginTop:"12px"}}>
              {scen.concepts.map((c,i) => <span key={i} style={{background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:T.textSub, fontSize:"11px", padding:"3px 9px", borderRadius:"6px"}}>{c}</span>)}
            </div>
          </div>
          <div className="lnx-content" style={{padding:"20px var(--lnx-gutter)", width:"100%", boxSizing:"border-box"}}>
            {scen.steps.map((step,si) => {
              const done = stepDone(scen.id,si);
              return (
                <div key={si} style={{marginBottom:"16px", display:"flex", gap:"12px"}}>
                  <div style={{display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0}}>
                    <button aria-label={`Step ${si+1}: ${done ? "mark incomplete" : "mark done"}`} aria-pressed={done} onClick={() => toggleStep(scen.id,si)} style={{width:"36px", height:"36px", borderRadius:"50%", border:`2px solid ${done ? scColor : "rgba(255,255,255,0.15)"}`, background:done ? `rgba(${scRGB},0.2)` : "rgba(255,255,255,0.04)", color:done ? scColor : T.textMute, fontSize:"13px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:font}}>{done ? "✓" : si+1}</button>
                    {si<scen.steps.length-1 && <div style={{width:"2px", flex:1, background:done ? `rgba(${scRGB},0.35)` : "rgba(255,255,255,0.07)", marginTop:"6px", minHeight:"16px"}}/>}
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{background:done ? `rgba(${scRGB},0.05)` : T.card, border:`1px solid ${done ? `rgba(${scRGB},0.3)` : "rgba(255,255,255,0.08)"}`, borderRadius:"12px", overflow:"hidden"}}>
                      <div style={{padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"10px", flexWrap:"wrap"}}>
                          <div style={{flex:1, minWidth:0}}>
                            <span style={{fontSize:"10px", color:T.textDim, fontWeight:500, letterSpacing:"1px"}}>STEP {si+1}</span>
                            <h3 style={{margin:"3px 0 0", fontSize:"15px", fontWeight:700, color:done ? scColor : T.text}}>{step.title}</h3>
                          </div>
                          <button onClick={() => toggleStep(scen.id,si)} style={{background:done ? `rgba(${scRGB},0.15)` : "rgba(255,255,255,0.05)", border:`1px solid ${done ? scColor : "rgba(255,255,255,0.12)"}`, color:done ? scColor : T.textMute, padding:"5px 12px", borderRadius:"8px", cursor:"pointer", fontSize:"12px", fontWeight:600, fontFamily:font, whiteSpace:"nowrap"}}>{done ? "✓ Done" : "Mark Done"}</button>
                        </div>
                        {step.context && <p style={{margin:"8px 0 0", fontSize:"13px", color:T.textSub, lineHeight:"1.7", background:"rgba(255,255,255,0.03)", borderLeft:`3px solid rgba(${scRGB},0.4)`, padding:"7px 10px", borderRadius:"0 6px 6px 0"}}>{step.context}</p>}
                      </div>
                      <div style={{padding:"12px 16px", display:"flex", flexDirection:"column", gap:"10px"}}>
                        {step.cmds.map(({cmd,why},ci) => (
                          <div key={ci} style={{background:"#060B14", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"10px", overflow:"hidden"}}>
                            <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"10px 12px", borderBottom:"1px solid rgba(255,255,255,0.05)", gap:"8px"}}>
                              <pre style={{fontFamily:mono, fontSize:"12px", color:T.green, flex:1, margin:0, whiteSpace:"pre-wrap", wordBreak:"break-all", lineHeight:"1.6"}}><span style={{color:T.textDim, userSelect:"none"}}>$ </span>{cmd}</pre>
                              <button onClick={(e) => {e.stopPropagation(); copyCmd(cmd);}} style={{background:copiedCmd===cmd ? `rgba(${scRGB},0.2)` : "rgba(255,255,255,0.06)", border:`1px solid ${copiedCmd===cmd ? scColor : "rgba(255,255,255,0.1)"}`, color:copiedCmd===cmd ? scColor : T.textMute, padding:"3px 9px", borderRadius:"6px", cursor:"pointer", fontSize:"11px", fontWeight:600, fontFamily:font, flexShrink:0, whiteSpace:"nowrap"}}>{copiedCmd===cmd ? "✓" : "Copy"}</button>
                            </div>
                            <div style={{padding:"9px 12px", display:"flex", gap:"8px", alignItems:"flex-start"}}>
                              <span style={{color:scColor, fontSize:"11px", fontWeight:700, flexShrink:0, marginTop:"2px"}}>WHY</span>
                              <span style={{fontSize:"12px", color:T.textSub, lineHeight:"1.75", wordBreak:"break-word"}}>{why}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {scenarioDone(scen) && (
              <div style={{background:`rgba(${scRGB},0.1)`, border:`2px solid rgba(${scRGB},0.4)`, borderRadius:"14px", padding:"20px", textAlign:"center"}}>
                <div style={{fontSize:"36px", marginBottom:"8px"}}>🎉</div>
                <div style={{fontSize:"18px", fontWeight:700, color:scColor, marginBottom:"5px"}}>Scenario Complete!</div>
                <div style={{color:T.textSub, fontSize:"13px", marginBottom:"14px"}}>You ran all {totalCmds} commands. Solid LFCS practice.</div>
                <button onClick={() => setActiveScenario(null)} style={{background:`rgba(${scRGB},0.2)`, border:`1px solid ${scColor}`, color:scColor, padding:"9px 22px", borderRadius:"10px", cursor:"pointer", fontSize:"14px", fontWeight:600, fontFamily:font}}>Back to All Scenarios</button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  const activeCSTData = CHEATSHEET_TABS.find(t => t.id===activeCheatTab);

  return (
    <>
      <style>{POPPINS}{GLOBAL_CSS}</style>
      <div style={{background:T.bg, fontFamily:font, color:T.text}}>

        {/* Glossary Modal */}
        {glossaryWord && (
          <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.65)", zIndex:999, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"60px 16px 16px"}} onClick={() => setGlossaryWord(null)}>
            <div role="dialog" aria-modal="true" aria-label={`Glossary: ${glossaryWord}`} style={{background:T.card, border:`1px solid rgba(${rgb},0.4)`, borderRadius:"14px", padding:"20px 24px", maxWidth:"520px", width:"100%", maxHeight:"calc(100dvh - 100px)", overflowY:"auto", boxSizing:"border-box"}} onClick={e => e.stopPropagation()}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px"}}>
                <div>
                  <span style={{fontSize:"10px", color:T.textDim, letterSpacing:"1.5px"}}>GLOSSARY</span>
                  <h3 style={{margin:"3px 0 0", fontSize:"18px", fontWeight:700, color}}>{glossaryWord}</h3>
                </div>
                <button autoFocus aria-label="Close glossary" title="Close glossary" onClick={() => setGlossaryWord(null)} style={{background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:T.textMute, width:"30px", height:"30px", flexShrink:0, borderRadius:"50%", cursor:"pointer", fontSize:"14px", fontFamily:font}}>✕</button>
              </div>
              <p style={{margin:0, fontSize:"14px", color:T.textSub, lineHeight:"1.8", wordBreak:"break-word"}}>{GLOSSARY[glossaryWord]||"Definition not found."}</p>
            </div>
          </div>
        )}

        {/* ── HEADER ── */}
        <div className="lnx-band" style={{borderBottom:`1px solid rgba(${rgb},0.2)`, padding:"20px var(--lnx-gutter) 16px", background:`rgba(${rgb},0.04)`}}>
          <div className="lnx-summary-layout" style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"12px"}}>
            <div style={{flex:1, minWidth:0}}>
              <div style={{display:"flex", alignItems:"center", gap:"8px", marginBottom:"5px"}}>
                <span style={{background:`rgba(${rgb},0.18)`, border:`1px solid rgba(${rgb},0.4)`, color, fontSize:"10px", fontWeight:600, letterSpacing:"1.5px", padding:"3px 10px", borderRadius:"20px"}}>LFCS PREP · 12 WEEKS</span>
              </div>
              <h1 style={{fontSize:"28px", fontWeight:700, margin:"0 0 3px", color:T.text, lineHeight:1.2}}>Linux Administration: <span style={{color}}>Zero → Certified</span></h1>
              <p style={{color:T.textSub, fontSize:"13px", margin:0}}>12 Weeks · 3 Levels · {PHASES.reduce((s,p) => s+p.topics.length, 0)} Topics · {PHASES.reduce((s,p) => s+p.labs.length, 0)} Labs · {SCENARIOS.length} Scenarios · {PHASES.reduce((s,p) => s+p.assessment.questions.length, 0)} MCQs · {QUESTION_BANK.length} Mock Exam Questions</p>
            </div>
            <div style={{display:"flex", gap:"8px", alignItems:"flex-start", flexWrap:"wrap"}}>
              <div style={{background:`rgba(${rgb},0.1)`, border:`1px solid rgba(${rgb},0.3)`, borderRadius:"12px", padding:"10px 16px", textAlign:"center"}}>
                <div style={{fontSize:"24px", fontWeight:700, color, lineHeight:1}}>{totalPct()}%</div>
                <div style={{fontSize:"10px", color:T.textMute, marginTop:"3px"}}>OVERALL</div>
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:"6px"}}>
                <button onClick={openExam} style={{background:"rgba(52,211,153,0.16)", border:`1px solid ${T.green}`, color:T.green, padding:"6px 12px", borderRadius:"8px", cursor:"pointer", fontSize:"12px", fontWeight:700, fontFamily:font, boxShadow:"0 0 14px rgba(52,211,153,0.2)"}}>
                  {exam && exam.stage === "running" ? "▶ Resume Exam" : "📝 Mock Exam"}
                </button>
                <button onClick={() => {setShowCheatsheet(p=>!p); setShowLinks(false);}} style={{background:showCheatsheet ? `rgba(167,139,250,0.18)` : "transparent", border:`1px solid ${T.violet}`, color:T.violet, padding:"6px 12px", borderRadius:"8px", cursor:"pointer", fontSize:"12px", fontWeight:600, fontFamily:font}}>
                  {showCheatsheet ? "▲ Cheatsheet" : "▼ Cheatsheet"}
                </button>
                <button onClick={() => {setShowLinks(p=>!p); setShowCheatsheet(false);}} style={{background:showLinks ? `rgba(251,191,36,0.18)` : "transparent", border:`1px solid ${T.amber}`, color:T.amber, padding:"6px 12px", borderRadius:"8px", cursor:"pointer", fontSize:"12px", fontWeight:600, fontFamily:font}}>
                  {showLinks ? "▲ LFCS Links" : "▼ LFCS Links"}
                </button>
              </div>
            </div>
          </div>
          <div style={{display:"flex", gap:"8px", marginTop:"16px", flexWrap:"wrap"}}>
            {PHASES.map((p,i) => {
              const pRGB=phaseRGB[p.id]; const active=activePhase===i;
              return (
                <button key={p.id} onClick={() => {setActivePhase(i); setActiveTab("topics"); setExpandedTopic(null); setOpenSolution(null);}}
                  style={{background:active ? `rgba(${pRGB},0.16)` : "rgba(255,255,255,0.04)", border:`2px solid ${active ? p.color : "rgba(255,255,255,0.1)"}`, color:active ? p.color : T.textMute, padding:"8px 16px", borderRadius:"10px", cursor:"pointer", fontSize:"12px", fontWeight:600, fontFamily:font, boxShadow:active ? `0 0 16px rgba(${pRGB},0.2)` : "none", display:"flex", alignItems:"center", gap:"6px"}}>
                  <span style={{fontSize:"16px"}}>{p.icon}</span>
                  <span>{p.badge} · {p.level}</span>
                  <span style={{fontSize:"10px", opacity:.55, fontWeight:400}}>{p.duration}</span>
                  {mcqChecked[p.id] && <span style={{background:`rgba(${pRGB},0.2)`, color:T.green, fontSize:"10px", fontWeight:700, padding:"2px 6px", borderRadius:"6px"}}>✓ {quizScore(p.id).pct}%</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cheatsheet Panel */}
        {showCheatsheet && (
          <div className="lnx-band" style={{background:`rgba(167,139,250,0.05)`, borderBottom:`1px solid rgba(167,139,250,0.2)`, padding:"0 var(--lnx-gutter)"}}>
            <div style={{display:"flex", overflowX:"auto", borderBottom:"1px solid rgba(167,139,250,0.15)"}}>
              {CHEATSHEET_TABS.map(t => (
                <button key={t.id} onClick={() => setActiveCheatTab(t.id)}
                  style={{background:"transparent", border:"none", borderBottom:activeCheatTab===t.id ? `3px solid ${T.violet}` : "3px solid transparent", color:activeCheatTab===t.id ? T.violet : T.textDim, padding:"10px 14px", cursor:"pointer", fontSize:"11px", fontWeight:activeCheatTab===t.id ? 700 : 400, fontFamily:font, whiteSpace:"nowrap", letterSpacing:"0.5px"}}>
                  {t.label}
                </button>
              ))}
            </div>
            {activeCSTData && (
              <div style={{padding:"14px 0 16px"}}>
                <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,220px),1fr))", gap:"10px"}}>
                  {activeCSTData.cats.map(cat => (
                    <div key={cat.cat} style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(167,139,250,0.12)", borderRadius:"10px", padding:"12px"}}>
                      <div style={{color:T.violet, fontSize:"11px", letterSpacing:"1px", fontWeight:700, marginBottom:"8px"}}>{cat.cat}</div>
                      {cat.cmds.map((item,i) => (
                        <div key={i} style={{borderBottom:i<cat.cmds.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none", padding:"5px 0"}}>
                          <div style={{fontFamily:mono, fontSize:"10px", color:T.green, wordBreak:"break-all", marginBottom:"2px"}}>$ {item.cmd}</div>
                          <div style={{fontSize:"11px", color:T.textDim, lineHeight:"1.5"}}>{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div style={{marginTop:"12px", paddingTop:"10px", borderTop:"1px solid rgba(167,139,250,0.12)", display:"flex", justifyContent:"flex-end"}}>
                  <a href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener noreferrer"
                    style={{display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"12px", color:T.violet, textDecoration:"none", fontWeight:600, background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.3)", padding:"5px 14px", borderRadius:"8px"}}>
                    ↗ Linux man pages | man7.org
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LFCS Links */}
        {showLinks && (
          <div className="lnx-band" style={{background:`rgba(251,191,36,0.04)`, borderBottom:`1px solid rgba(251,191,36,0.18)`, padding:"16px var(--lnx-gutter)"}}>
            <p style={{color:T.amber, fontSize:"11px", letterSpacing:"1.5px", margin:"0 0 12px", fontWeight:600}}>// LFCS STUDY RESOURCES</p>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"10px"}}>
              {EXAM_LINKS.map(cat => (
                <div key={cat.cat} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(251,191,36,0.15)", borderRadius:"10px", padding:"12px"}}>
                  <div style={{color:T.amber, fontSize:"11px", letterSpacing:"1px", fontWeight:600, marginBottom:"8px"}}>{cat.cat}</div>
                  {cat.links.map((l,i) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                      style={{display:"block", fontSize:"12px", color:T.textSub, padding:"4px 0", borderBottom:i<cat.links.length-1 ? "1px solid rgba(255,255,255,0.06)" : "none", textDecoration:"none", lineHeight:"1.5"}}>
                      <span style={{color:T.amber, marginRight:"4px"}}>↗</span>{l.title}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="lnx-content" style={{padding:"20px var(--lnx-gutter)", boxSizing:"border-box"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px", flexWrap:"wrap", gap:"10px"}}>
            <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
              <div style={{width:"44px", height:"44px", borderRadius:"12px", background:`rgba(${rgb},0.15)`, border:`2px solid rgba(${rgb},0.4)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0}}>{phase.icon}</div>
              <div>
                <div style={{color, fontSize:"11px", fontWeight:600, letterSpacing:"1.5px"}}>{phase.level} · {phase.duration} · {phase.topics.length} Topics</div>
                <h2 style={{margin:"2px 0 0", fontSize:"18px", fontWeight:700, color:T.text}}>{phase.title}</h2>
                <div style={{color:T.textSub, fontSize:"13px"}}>{phase.subtitle}</div>
              </div>
            </div>
            {mcqChecked[phaseId] && (
              <div style={{background:`rgba(${rgb},0.1)`, border:`1px solid rgba(${rgb},0.3)`, borderRadius:"12px", padding:"10px 16px", textAlign:"center"}}>
                <div style={{fontSize:"22px", fontWeight:700, color, lineHeight:1}}>{quizScore(phaseId).pct}%</div>
                <div style={{fontSize:"10px", color:T.textMute, marginTop:"2px"}}>{quizScore(phaseId).correct}/{quizScore(phaseId).total} CORRECT</div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{display:"flex", gap:"2px", borderBottom:"2px solid rgba(255,255,255,0.07)", marginBottom:"18px", overflowX:"auto"}}>
            {["topics","labs","scenarios","assessment"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{background:"transparent", border:"none", borderBottom:activeTab===tab ? `3px solid ${color}` : "3px solid transparent", color:activeTab===tab ? color : T.textMute, padding:"8px 16px", cursor:"pointer", fontSize:"12px", fontWeight:activeTab===tab ? 600 : 400, fontFamily:font, textTransform:"uppercase", letterSpacing:"1px", marginBottom:"-2px", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:"5px"}}>
                {tab}
                {tab==="scenarios" && <span style={{background:`rgba(${rgb},0.2)`, color, fontSize:"10px", fontWeight:700, padding:"1px 5px", borderRadius:"10px"}}>{phaseScenarios.length}</span>}
                {tab==="labs" && <span style={{background:`rgba(${rgb},0.2)`, color, fontSize:"10px", fontWeight:700, padding:"1px 5px", borderRadius:"10px"}}>{phase.labs.length}</span>}
                {tab==="assessment" && <span style={{background:`rgba(${rgb},0.2)`, color, fontSize:"10px", fontWeight:700, padding:"1px 5px", borderRadius:"10px"}}>{phase.assessment.questions.length}</span>}
              </button>
            ))}
          </div>

          {/* TOPICS */}
          {activeTab==="topics" && (
            <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
              <p style={{margin:"0 0 10px", fontSize:"12px", color:T.textMute, lineHeight:"1.6"}}>
                Click <span style={{color, textDecoration:"underline dotted", fontWeight:600}}>underlined keywords</span> to expand their definition from the glossary.
              </p>
              {phase.topics.map((topic,ti) => {
                const isOpen = expandedTopic===ti;
                return (
                  <div key={ti} style={{border:`1px solid ${isOpen ? color+"60" : "rgba(255,255,255,0.08)"}`, borderRadius:"12px", overflow:"hidden", background:isOpen ? `rgba(${rgb},0.05)` : "rgba(255,255,255,0.02)"}}>
                    <button onClick={() => setExpandedTopic(isOpen ? null : ti)}
                      style={{width:"100%", background:"transparent", border:"none", padding:"14px 16px", cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center", fontFamily:font, gap:"10px"}}>
                      <div style={{display:"flex", alignItems:"center", gap:"12px", flex:1, minWidth:0}}>
                        <span style={{background:isOpen ? color : `rgba(${rgb},0.2)`, color:isOpen ? "#000" : color, width:"28px", height:"28px", borderRadius:"7px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:700, flexShrink:0}}>{ti+1}</span>
                        <span style={{fontSize:"15px", fontWeight:600, color:T.text}}>{topic.title}</span>
                      </div>
                      <span style={{color, fontSize:"16px", transform:isOpen ? "rotate(90deg)" : "none", flexShrink:0}}>▶</span>
                    </button>
                    {isOpen && (
                      <div style={{padding:"0 16px 16px"}}>
                        <div style={{background:T.surface, border:`1px solid rgba(${rgb},0.25)`, borderLeft:`4px solid ${color}`, borderRadius:"0 10px 10px 0", padding:"14px 16px", marginBottom:"14px"}}>
                          <span style={{background:`rgba(${rgb},0.18)`, color, fontSize:"10px", fontWeight:700, letterSpacing:"1.5px", padding:"3px 9px", borderRadius:"20px", display:"inline-block", marginBottom:"10px"}}>📖 LESSON</span>
                          {renderExpl(topic.explanation, topic.keywords)}
                        </div>
                        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,260px),1fr))", gap:"14px"}}>
                          <div>
                            <div style={{color:T.pink, fontSize:"11px", fontWeight:600, letterSpacing:"1px", marginBottom:"10px"}}>WHAT YOU'LL LEARN</div>
                            {topic.subtopics.map((s,si) => (
                              <div key={si} style={{display:"flex", gap:"8px", alignItems:"flex-start", marginBottom:"7px"}}>
                                <span style={{color, marginTop:"4px", flexShrink:0}}>›</span>
                                <span style={{fontSize:"13px", color:T.textSub, lineHeight:"1.6"}}>{s}</span>
                              </div>
                            ))}
                            {topic.resources && (
                              <div style={{marginTop:"14px"}}>
                                <div style={{color:T.amber, fontSize:"11px", fontWeight:600, letterSpacing:"1px", marginBottom:"8px"}}>📚 FURTHER READING</div>
                                {topic.resources.map((r,ri) => (
                                  <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                                    style={{display:"flex", alignItems:"flex-start", gap:"6px", fontSize:"12px", color:T.textSub, marginBottom:"5px", textDecoration:"none", lineHeight:"1.5"}}>
                                    <span style={{color:T.amber, flexShrink:0, marginTop:"1px"}}>↗</span>
                                    <span style={{borderBottom:`1px solid rgba(251,191,36,0.3)`}}>{r.title}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{color:T.green, fontSize:"11px", fontWeight:600, letterSpacing:"1px", marginBottom:"10px"}}>KEY COMMANDS</div>
                            <div style={{background:"#060B14", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"10px", overflow:"hidden"}}>
                              {topic.commands.map(({cmd,desc},ci) => (
                                <div key={ci} style={{padding:"10px 12px", borderBottom:ci<topic.commands.length-1 ? "1px solid rgba(255,255,255,0.06)" : "none"}}>
                                  <div style={{fontFamily:mono, fontSize:"11px", color:T.green, marginBottom:"4px", wordBreak:"break-all"}}><span style={{color:T.textDim}}>$ </span>{cmd}</div>
                                  <div style={{fontSize:"12px", color:T.textSub, lineHeight:"1.6", paddingLeft:"12px", borderLeft:`2px solid rgba(${rgb},0.35)`}}>{desc}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* LABS */}
          {activeTab==="labs" && (
            <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
              {phase.labs.map((lab,li) => {
                const dc=diffColor(lab.difficulty);
                const isOpen=openSolution===li;
                return (
                  <div key={li} style={{background:T.card, border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", overflow:"hidden"}}>
                    <div style={{height:"3px", background:dc}}/>
                    <div style={{padding:"16px"}}>
                      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"12px", flexWrap:"wrap"}}>
                        <div style={{flex:1, minWidth:0}}>
                          <div style={{display:"flex", alignItems:"center", gap:"8px", marginBottom:"7px", flexWrap:"wrap"}}>
                            <span style={{fontSize:"11px", color:T.textDim, fontWeight:500}}>LAB {li+1+(activePhase===0 ? 0 : activePhase===1 ? 5 : 10)}</span>
                            <span style={{fontSize:"11px", fontWeight:600, padding:"2px 9px", borderRadius:"20px", color:dc, background:`${dc}1A`}}>{lab.difficulty.toUpperCase()}</span>
                          </div>
                          <div style={{fontSize:"15px", fontWeight:700, color, marginBottom:"6px"}}>{lab.title}</div>
                          <div style={{fontSize:"13px", color:T.textSub, lineHeight:"1.75"}}>{lab.desc}</div>
                        </div>
                        <button onClick={() => setOpenSolution(isOpen ? null : li)} style={{background:isOpen ? `rgba(${rgb},0.18)` : "rgba(255,255,255,0.06)", border:`1px solid ${isOpen ? color : "rgba(255,255,255,0.12)"}`, color:isOpen ? color : T.textSub, padding:"7px 14px", borderRadius:"8px", cursor:"pointer", fontSize:"12px", fontWeight:600, fontFamily:font, flexShrink:0}}>
                          {isOpen ? "▲ Hide" : "▼ Solution"}
                        </button>
                      </div>
                      {isOpen && (
                        <div style={{marginTop:"12px", background:"#060B14", border:`1px solid rgba(${rgb},0.25)`, borderLeft:`4px solid ${color}`, borderRadius:"0 10px 10px 0", padding:"14px 16px"}}>
                          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px"}}>
                            <div style={{color, fontSize:"11px", fontWeight:700, letterSpacing:"1px"}}>💡 SOLUTION</div>
                            <button onClick={(e) => {e.stopPropagation(); copyCmd(lab.solution);}} style={{background:copiedCmd===lab.solution ? `rgba(${rgb},0.2)` : "rgba(255,255,255,0.06)", border:`1px solid ${copiedCmd===lab.solution ? color : "rgba(255,255,255,0.1)"}`, color:copiedCmd===lab.solution ? color : T.textMute, padding:"3px 10px", borderRadius:"6px", cursor:"pointer", fontSize:"11px", fontWeight:600, fontFamily:font}}>
                              {copiedCmd===lab.solution ? "✓ Copied" : "Copy"}
                            </button>
                          </div>
                          <pre style={{margin:0, fontFamily:mono, fontSize:"11px", color:T.green, lineHeight:"1.8", whiteSpace:"pre-wrap", wordBreak:"break-all"}}>{lab.solution}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div style={{background:`rgba(${rgb},0.06)`, border:`2px dashed rgba(${rgb},0.25)`, borderRadius:"12px", padding:"16px", textAlign:"center"}}>
                <div style={{fontSize:"22px", marginBottom:"7px"}}>🔧</div>
                <div style={{color, fontSize:"13px", fontWeight:600, marginBottom:"8px"}}>Free Practice Platforms</div>
                {[
                  {label:"Killercoda — free browser-based Linux playgrounds",url:"https://killercoda.com/playgrounds"},
                  {label:"Multipass — instant Ubuntu VMs on any laptop",url:"https://canonical.com/multipass"},
                  {label:"VirtualBox — run Rocky Linux and Ubuntu side by side",url:"https://www.virtualbox.org/"},
                  {label:"Vagrant — reproducible multi-VM labs",url:"https://developer.hashicorp.com/vagrant"},
                ].map((p,i) => (
                  <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" style={{display:"block", fontSize:"13px", color:T.textSub, marginBottom:"4px", textDecoration:"none"}}>
                    <span style={{color}}>↗ </span>{p.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* SCENARIOS */}
          {activeTab==="scenarios" && (
            <div>
              <p style={{color:T.textSub, fontSize:"13px", marginTop:0, marginBottom:"16px", lineHeight:"1.7"}}>
                Each scenario is a complete real-world task — like an LFCS exam task. Every command has a WHY explanation. Mark steps done as you go.
              </p>
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,270px),1fr))", gap:"12px"}}>
                {phaseScenarios.map(scen => {
                  const done=scenarioDone(scen);
                  const scRGB=phaseRGB[scen.phase];
                  const scColor=PHASES.find(p => p.id===scen.phase).color;
                  const totalCmds=scen.steps.reduce((s,st) => s+st.cmds.length, 0);
                  const doneCmds=scen.steps.reduce((s,st,si) => s+(stepDone(scen.id,si) ? st.cmds.length : 0), 0);
                  const pct=Math.round((doneCmds/totalCmds)*100);
                  const dc=scen.difficulty==="Beginner" ? T.green : scen.difficulty==="Intermediate" ? T.amber : T.red;
                  return (
                    <div key={scen.id} role="button" tabIndex={0} aria-label={`Open scenario: ${scen.title}`} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") {e.preventDefault(); setActiveScenario(scen.id);} }} style={{background:T.card, border:`1px solid ${done ? `rgba(${scRGB},0.4)` : "rgba(255,255,255,0.08)"}`, borderRadius:"14px", overflow:"hidden", cursor:"pointer"}} onClick={() => setActiveScenario(scen.id)}>
                      <div style={{height:"3px", background:done ? scColor : `linear-gradient(90deg,${scColor} ${pct}%,rgba(255,255,255,0.08) ${pct}%)`}}/>
                      <div style={{padding:"14px"}}>
                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"8px"}}>
                          <div style={{fontSize:"26px"}}>{scen.emoji}</div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontSize:"16px", fontWeight:700, color:pct===0 ? T.textMute : scColor, lineHeight:1}}>{pct}%</div>
                            <div style={{fontSize:"10px", color:T.textDim, marginTop:"2px"}}>{doneCmds}/{totalCmds}</div>
                          </div>
                        </div>
                        <div style={{display:"flex", gap:"4px", marginBottom:"6px", flexWrap:"wrap"}}>
                          <span style={{fontSize:"10px", fontWeight:600, color:dc, background:`${dc}1A`, padding:"2px 7px", borderRadius:"5px"}}>{scen.difficulty}</span>
                          <span style={{fontSize:"10px", color:T.textDim, background:"rgba(255,255,255,0.05)", padding:"2px 7px", borderRadius:"5px"}}>{scen.duration}</span>
                          <span style={{fontSize:"10px", color:scen.examWeight==="Critical" ? T.red : T.amber, background:scen.examWeight==="Critical" ? "rgba(248,113,113,0.12)" : "rgba(251,191,36,0.12)", padding:"2px 7px", borderRadius:"5px", fontWeight:600}}>LFCS: {scen.examWeight}</span>
                        </div>
                        <h3 style={{margin:"0 0 2px", fontSize:"13px", fontWeight:700, color:T.text}}>{scen.title}</h3>
                        <p style={{margin:"0 0 8px", fontSize:"11px", color:T.textSub, lineHeight:"1.4"}}>{scen.subtitle}</p>
                        <div style={{display:"flex", flexWrap:"wrap", gap:"3px", marginBottom:"10px"}}>
                          {scen.concepts.slice(0,3).map((c,i) => <span key={i} style={{fontSize:"10px", color:T.textDim, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", padding:"2px 6px", borderRadius:"4px"}}>{c}</span>)}
                          {scen.concepts.length>3 && <span style={{fontSize:"10px", color:T.textDim}}>+{scen.concepts.length-3}</span>}
                        </div>
                        <div style={{background:`rgba(${scRGB},0.12)`, border:`1px solid rgba(${scRGB},0.3)`, borderRadius:"8px", padding:"6px 12px", color:scColor, fontSize:"12px", fontWeight:600, textAlign:"center"}}>
                          {done ? "✓ Completed — Review" : "▶ Start Scenario"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ASSESSMENT */}
          {activeTab==="assessment" && (
            <div>
              {mcqChecked[phaseId] && (() => {
                const s=quizScore(phaseId);
                const grade=s.pct>=85 ? {label:"Champion! 🏆",c:T.green} : s.pct>=60 ? {label:"Good — Review Misses 📖",c:T.amber} : {label:"Needs More Practice 🔁",c:T.red};
                return (
                  <div style={{background:`rgba(${rgb},0.08)`, border:`2px solid rgba(${rgb},0.3)`, borderRadius:"14px", padding:"16px 20px", marginBottom:"16px", display:"flex", alignItems:"center", gap:"20px", flexWrap:"wrap"}}>
                    <div style={{textAlign:"center", minWidth:"70px"}}>
                      <div style={{fontSize:"36px", fontWeight:700, color, lineHeight:1}}>{s.pct}%</div>
                      <div style={{fontSize:"11px", color:T.textMute, marginTop:"3px"}}>{s.correct} / {s.total}</div>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"16px", fontWeight:700, color:grade.c}}>{grade.label}</div>
                      <div style={{fontSize:"13px", color:T.textSub, marginTop:"3px"}}>Explanations shown below each question</div>
                    </div>
                    <button onClick={retryQuiz} style={{background:"transparent", border:"1px solid rgba(255,255,255,0.2)", color:T.textSub, padding:"7px 16px", borderRadius:"8px", cursor:"pointer", fontSize:"12px", fontWeight:600, fontFamily:font}}>Retry</button>
                  </div>
                );
              })()}
              <div style={{display:"flex", flexDirection:"column", gap:"12px"}}>
                {phase.assessment.questions.map((q,qi) => {
                  const chosen=mcqAnswers[`${phaseId}-${qi}`];
                  const checked=mcqChecked[phaseId];
                  const isRight=chosen===q.answer;
                  return (
                    <div key={qi} style={{background:T.card, border:`1px solid ${checked ? (isRight ? "rgba(52,211,153,0.4)" : "rgba(248,113,113,0.4)") : "rgba(255,255,255,0.08)"}`, borderRadius:"12px", padding:"16px"}}>
                      <div style={{display:"flex", gap:"10px", marginBottom:"12px"}}>
                        <span style={{background:`rgba(${rgb},0.22)`, color, width:"26px", height:"26px", borderRadius:"7px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:700, flexShrink:0, marginTop:"1px"}}>Q{qi+1}</span>
                        <span style={{fontSize:"14px", color:T.text, lineHeight:"1.65", fontWeight:600}}>{q.q}</span>
                      </div>
                      <div style={{display:"flex", flexDirection:"column", gap:"6px", paddingLeft:"36px"}}>
                        {q.options.map((opt,oi) => {
                          const selected=chosen===oi; const isCorrect=oi===q.answer;
                          let bg="rgba(255,255,255,0.03)", bc="rgba(255,255,255,0.1)", tc=T.textSub;
                          if (!checked&&selected) {bg=`rgba(${rgb},0.14)`;bc=color;tc=T.text;}
                          if (checked&&isCorrect) {bg="rgba(52,211,153,0.12)";bc=T.green;tc="#D1FAE5";}
                          if (checked&&selected&&!isCorrect) {bg="rgba(248,113,113,0.12)";bc=T.red;tc="#FEE2E2";}
                          return (
                            <div key={oi} role="radio" aria-checked={selected} aria-disabled={checked} tabIndex={checked ? -1 : 0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") {e.preventDefault(); pickAnswer(qi,oi);} }} onClick={() => pickAnswer(qi,oi)} style={{display:"flex", alignItems:"flex-start", gap:"8px", padding:"9px 12px", borderRadius:"8px", cursor:checked ? "default" : "pointer", background:bg, border:`1px solid ${bc}`}}>
                              <div style={{width:"16px", height:"16px", borderRadius:"50%", border:`2px solid ${bc}`, background:((!checked&&selected)||(checked&&isCorrect)) ? bc : "transparent", flexShrink:0, marginTop:"2px", display:"flex", alignItems:"center", justifyContent:"center"}}>
                                {checked&&isCorrect&&<span style={{fontSize:"9px",color:"#000",fontWeight:900}}>✓</span>}
                                {checked&&selected&&!isCorrect&&<span style={{fontSize:"9px",color:"#fff",fontWeight:900}}>✗</span>}
                              </div>
                              <span style={{fontSize:"13px", color:tc, lineHeight:"1.55"}}>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                      {checked && (
                        <div style={{marginTop:"10px", paddingLeft:"36px"}}>
                          <div style={{background:isRight ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border:`1px solid ${isRight ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`, borderRadius:"8px", padding:"10px 12px", display:"flex", gap:"8px", alignItems:"flex-start"}}>
                            <span style={{fontSize:"12px", fontWeight:700, color:isRight ? T.green : T.red, flexShrink:0}}>{isRight ? "✓ Correct" : "✗ Wrong"}</span>
                            <span style={{fontSize:"12px", color:T.textSub, lineHeight:"1.65"}}>{q.explain}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {!mcqChecked[phaseId] && (
                <div style={{marginTop:"16px", textAlign:"center"}}>
                  <button onClick={submitQuiz} disabled={!allAnswered} style={{background:allAnswered ? `rgba(${rgb},0.2)` : "rgba(255,255,255,0.04)", border:`2px solid ${allAnswered ? color : "rgba(255,255,255,0.1)"}`, color:allAnswered ? color : T.textDim, padding:"10px 30px", borderRadius:"10px", cursor:allAnswered ? "pointer" : "not-allowed", fontSize:"14px", fontWeight:700, fontFamily:font, letterSpacing:"1px"}}>
                    Submit Quiz ({answeredCount}/{phase.assessment.questions.length} answered)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
