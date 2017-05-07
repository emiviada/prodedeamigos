# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network :private_network, ip: "10.10.10.100"

  # synced folder
  config.vm.synced_folder ".", "/var/www", owner: "www-data", group: "www-data", mount_options: ["dmode=777","fmode=777"]

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.cpus = 1
  end

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "provision/playbook.yml"
    ansible.groups = {
            "development" => ["default"]
        }
  end
end
