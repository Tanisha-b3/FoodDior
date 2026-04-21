provider "aws" {
  region = "us-east-1"
}

# -----------------------
# VPC
# -----------------------
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "waste-food-vpc"
  }
}

# -----------------------
# Internet Gateway
# -----------------------
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "waste-food-igw"
  }
}

# -----------------------
# Subnets
# -----------------------
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "waste-food-public-a"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "waste-food-public-b"
  }
}

# -----------------------
# Route Table
# -----------------------
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "waste-food-rt"
  }
}

resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public_rt.id
}

# -----------------------
# Security Group
# -----------------------
resource "aws_security_group" "ec2_sg" {
  name   = "waste-food-sg"
  vpc_id = aws_vpc.main.id

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP (Frontend via Nginx)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "waste-food-sg"
  }
}

# -----------------------
# Key Pair
# -----------------------
resource "aws_key_pair" "deployer" {
  key_name   = "waste-food-key"
  public_key = file("~/.ssh/id_rsa.pub")
}

# -----------------------
# EC2 Instance
# -----------------------
resource "aws_instance" "app" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t2.micro"

  subnet_id              = aws_subnet.public_a.id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  key_name               = aws_key_pair.deployer.key_name

  associate_public_ip_address = true

  user_data = <<-EOF
              #!/bin/bash
              yum update -y

              # Install Nginx
              amazon-linux-extras install nginx1 -y
              systemctl start nginx
              systemctl enable nginx

              # Install Node.js
              curl -sL https://rpm.nodesource.com/setup_18.x | bash -
              yum install -y nodejs

              # Install PM2
              npm install -g pm2
              EOF

  tags = {
    Name = "waste-food-app"
  }
}

# -----------------------
# Elastic IP
# -----------------------
resource "aws_eip" "app_ip" {
  instance = aws_instance.app.id
}

# -----------------------
# Outputs
# -----------------------
output "public_ip" {
  value = aws_eip.app_ip.public_ip
}

output "ssh_command" {
  value = "ssh ec2-user@${aws_eip.app_ip.public_ip}"
}