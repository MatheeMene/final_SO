top -b -d1 -n1|grep -i "Cpu(s)"|head -c21|cut -d ' ' -f2|cut -d '%' -f1 
