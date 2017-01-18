# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 443, host: 5443
  config.vm.network "forwarded_port", guest: 80, host: 580
  config.vm.network :private_network, ip: "10.0.0.100"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.name = "sym-ang-stack"
    vb.cpus = 1
  end

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "provision/playbook.yml"
    ansible.groups = {
            "development" => ["default"]
        }
  end
end
